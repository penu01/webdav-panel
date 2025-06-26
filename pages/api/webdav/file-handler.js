import { createClient } from 'webdav';
import multer from 'multer';

// Multer'ı bellek depolamasıyla yapılandır
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // Yükleme işlemi için Next.js'in parser'ını devre dışı bırak
    responseLimit: false,
  },
};

// Multer middleware'ini bir Promise'e sararak async/await ile kullanılabilir hale getir
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Helper to parse JSON body when bodyParser is off
async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.headers['content-type'] !== 'application/json') {
      req.body = {};
      return resolve();
    }
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString();
        req.body = body ? JSON.parse(body) : {};
        resolve();
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

export default async function handler(req, res) {
  try {
    const { action } = req.query;

    if (action === 'upload') {
      // Yükleme işlemi için önce Multer'ı çalıştır
      await runMiddleware(req, res, upload.single('file'));
      
      const { path } = req.body;
      const clientOptions = JSON.parse(req.body.client);
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'Yüklenecek dosya bulunamadı.' });
      }
      if (!path || !clientOptions) {
          return res.status(400).json({ message: 'Gerekli alanlar eksik: path, client' });
      }

      const client = createClient(clientOptions.url, { username: clientOptions.username, password: clientOptions.password });
      const targetPath = `${path}/${file.originalname}`;
      
      const stream = await client.createWriteStream(targetPath);
      stream.write(file.buffer);
      stream.end();

      return res.status(200).json({ message: 'Dosya başarıyla yüklendi.' });
    }

    // For all other actions, parse the body manually
    await parseJsonBody(req);
    
    // The rest of the handler logic now has access to req.body
    const { path = '/' } = req.query;
    // client bilgisi req.body.client içinde olabilir (rename/delete gibi) veya doğrudan req.body olabilir (connect gibi)
    const clientOptions = req.body.client || req.body; 

    // IMPORTANT: For rename, oldPath and newPath are in the root of the body
    const { oldPath, newPath } = req.body; 

    if (!action || !clientOptions || !clientOptions.url) {
      return res.status(400).json({ message: 'Gerekli alanlar eksik: action, client bilgileri' });
    }

    const client = createClient(clientOptions.url, {
      username: clientOptions.username,
      password: clientOptions.password,
    });
    
    // Switch-case'den önce yeni action'ı ekleyelim
    if (action === 'connect') {
      try {
        await client.getDirectoryContents('/');
        return res.status(200).json({ message: 'Bağlantı başarılı.' });
      } catch (error) {
        // Hata detayını istemciye gönderelim
        throw error;
      }
    }

    switch (action) {
      case 'get-link':
        // Get direct download link for a file
        if (!path || path === '/') {
          return res.status(400).json({ message: 'Dosya yolu (path) gereklidir.' });
        }
        const downloadLink = client.getFileDownloadLink(path);
        res.status(200).json({ url: downloadLink });
        break;

      case 'stream':
        // Stream file content
        if (!path || path === '/') {
          return res.status(400).json({ message: 'Dosya yolu (path) gereklidir.' });
        }
        const stat = await client.stat(path);
        const mimeType = stat.mime || 'application/octet-stream';
        
        res.writeHead(200, {
          'Content-Type': mimeType,
          'Content-Length': stat.size
        });

        const stream = client.createReadStream(path);
        await new Promise((resolve, reject) => {
          stream.pipe(res);
          stream.on('error', reject);
          stream.on('end', resolve);
          stream.on('finish', resolve);
        });
        break;

      case 'files':
        // Get directory contents
        const contents = await client.getDirectoryContents(path, { deep: false });
        const processedContents = contents.map(item => ({
          ...item,
          filename: item.filename,
          basename: item.basename,
          lastmod: item.lastmod,
          size: item.size,
          type: item.type
        })).sort((a, b) => {
          if (a.type === 'directory' && b.type !== 'directory') return -1;
          if (a.type !== 'directory' && b.type === 'directory') return 1;
          return a.basename.localeCompare(b.basename);
        });

        res.status(200).json(processedContents);
        break;

      case 'download':
        // Download file content
        if (!path || path === '/') {
          return res.status(400).json({ message: 'Dosya yolu (path) gereklidir.' });
        }
        const fileContents = await client.getFileContents(path);
        const filename = path.split('/').pop();
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(Buffer.from(fileContents));
        break;

      case 'delete':
        // Delete file or directory
        if (!path || path === '/') {
          return res.status(400).json({ message: 'Dosya yolu (path) gereklidir.' });
        }
        await client.deleteFile(path);
        res.status(200).json({ message: 'Dosya başarıyla silindi.' });
        break;

      case 'rename':
        if (!oldPath || !newPath) {
          return res.status(400).json({ message: 'Eski ve yeni yol gereklidir.' });
        }
        await client.moveFile(oldPath, newPath);
        res.status(200).json({ message: 'Dosya başarıyla yeniden adlandırıldı.' });
        break;

      case 'save':
        // Save file content
        const { content } = req.body;
        if (!path || path === '/' || typeof content === 'undefined') {
          return res.status(400).json({ message: 'Dosya yolu (path) ve içerik (content) gereklidir.' });
        }
        await client.putFileContents(path, content);
        res.status(200).json({ message: 'Dosya başarıyla kaydedildi.' });
        break;

      case 'create-folder':
        // path query parametresi olarak geldiği için req.body'den okunmaz
        if (!path || path === '/') {
          return res.status(400).json({ message: 'Oluşturulacak klasör yolu (path) gereklidir.' });
        }
        await client.createDirectory(path);
        res.status(200).json({ message: 'Klasör başarıyla oluşturuldu.' });
        break;

      default:
        res.status(400).json({ message: 'Geçersiz action: ' + action });
    }

  } catch (error) {
    // Error handling without console.log
    
    let message = 'İşlem sırasında bir hata oluştu.';
    let status = 500;

    if (error.response && error.response.status === 404) {
      message = `Dosya/dizin bulunamadı: ${req.query.path}`;
      status = 404;
    } else if (error.response && error.response.status === 401) {
      message = 'Kimlik doğrulama hatası. Kullanıcı adı veya şifre yanlış.';
      status = 401;
    } else if (error.response && error.response.status === 403) {
      message = 'Bu işlem için yetkiniz yok.';
      status = 403;
    }

    if (!res.headersSent) {
      res.status(status).json({ message, error: error.message });
    }
  }
} 