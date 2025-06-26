import random
import time

class QuizSystem:
    def __init__(self):
        self.questions = [
            {
                "question": "Minimumdan daha büyük refüj, durak alanı hangi yöntemle oluşturulur?",
                "options": [
                    "Raylara hafif S kurbu verilerek",
                    "Kare şeklinde dokulu kaplama kullanarak", 
                    "Enerji hattının konumunu değiştirerek",
                    "Sinyal adası tasarlayarak",
                    "Caddeyi genişleterek"
                ],
                "correct": "E",
                "explanation": "Cadde genişletildiğinde raylar arası refüj alanı da genişletilebilir.",
                "is_bonus": False
            },
            {
                "question": "Aşağıdakilerden hangisi kontrollü erişim istasyonlarını kullanan yolcuların beklentilerinden değildir?",
                "options": [
                    "Hizmet hakkında bilgi, yönlendirme",
                    "Hatlar arası aktarma yaparken minimum zaman ve mesafe",
                    "Minimum işletme maliyetleri",
                    "Estetik olan hoş tasarım, hava şartlarından korunma",
                    "Emniyet ve güvenlik"
                ],
                "correct": "C",
                "explanation": "İşletme maliyetleri yolcu beklentisi değil, işletmeci perspektifidir.",
                "is_bonus": False
            },
            {
                "question": "Aşağıdaki modlardan hangisi 60 saniyelik sefer aralıklarında hizmet sağlayabilir?",
                "options": [
                    "VAL modu",
                    "Bölgesel Demiryolu",
                    "Cadde Tramvayı",
                    "Hafif Raylı Sistem",
                    "Yerel Demiryolu"
                ],
                "correct": "C",
                "explanation": "Modern cadde tramvayları 60 saniyelik sefer aralıklarında hizmet verebilir.",
                "is_bonus": False
            },
            {
                "question": "İşletme birimi türlerinden (Single Units - SU) tekli araçların en önemli avantajı nedir?",
                "options": [
                    "Temel işletme birimi ne kadar küçükse içerdiği ekipmanlar o kadar fazla olur. Bakımı kolaylaşır.",
                    "Araçların iki ucunda makinist kumanda seti bulunması satın alma maliyetini azaltır.",
                    "Her araç kendi başına çalışabildiğinde maksimum İşletme esnekliği sağlanmış olur.",
                    "Trenlerde boji başına araç gövdesi uzunluğu mümkün olduğunca yüksek olur.",
                    "Tüm yardımcı mekanik ve elektrikli ekipmanlar daha az maliyetli olur."
                ],
                "correct": "C",
                "explanation": "Her araç bağımsız çalışabildiğinde işletme esnekliği maksimum olur.",
                "is_bonus": False
            },
            {
                "question": "(Articulated Units) Körüklü Araçların kullanımı hangi durumda yarar sağlar?",
                "options": [
                    "Tek bir aracın arıza yapması durumunda",
                    "Pik dışı saatlerde kullanıldığında",
                    "Yolcu hacimlerinin günün çoğu saatinde yüksek seviyelerde olduğu durumlarda",
                    "Minimum araç-kilometre ile işletmeye ihtiyaç olduğunda",
                    "Aynı hatta birden fazla işletme birimi türüne ihtiyaç duyulduğunda"
                ],
                "correct": "C",
                "explanation": "Körüklü araçlar yüksek yolcu hacimlerinde kapasite artışı sağlar.",
                "is_bonus": False
            },
            {
                "question": "Duraklar arasındaki açık bir hatta elde edilebilen en kısa sefer aralığı olarak tanımlanan terim aşağıdakilerden hangisidir?",
                "options": [
                    "Yön Sefer Aralığı",
                    "İstasyon Sefer Aralığı",
                    "İlkesel Sefer Aralığı",
                    "Minimum Sefer Sıklığı",
                    "Maksimum Sefer Aralığı"
                ],
                "correct": "B",
                "explanation": "İstasyon Sefer Aralığı, durak istasyonları arasındaki en kısa sefer aralığıdır.",
                "is_bonus": False
            },
            {
                "question": "Bir toplu taşıma biriminin bir uç istasyondan çıkışı ile hattaki diğer uç istasyona varışı arasındaki tarifeli zaman aralığı olarak ifade edilen süre aşağıdakilerden hangisidir?",
                "options": [
                    "İstasyondan İstasyona Yolculuk Süresi",
                    "Erişim Süresi",
                    "Tam Tur Süresi",
                    "İşletme Süresi",
                    "İstasyonda Kalış Süresi"
                ],
                "correct": "D",
                "explanation": "İşletme Süresi, uç istasyonlar arası tarifeli zaman aralığıdır.",
                "is_bonus": False
            },
            {
                "question": "Toplu ulaşım işletmesi için sefer tarifesi belirlemede kullanılan, yatırımları ve işletme maliyetlerini önemli ölçüde etkileyen temel zaman birimi aşağıdakilerden hangisidir?",
                "options": [
                    "Tam Tur Süresi",
                    "Uç İstasyon Süresi",
                    "Peron Süresi",
                    "İşletme Süresi",
                    "Aracın Yolcu Taşımadığı Süre"
                ],
                "correct": "A",
                "explanation": "Tam Tur Süresi, sefer tarifesi belirlemede kullanılan temel zaman birimidir.",
                "is_bonus": False
            },
            {
                "question": "Aşağıda verilen ulaşım modlarının hangisinde araç kapasitesi hesaplanırken sadece koltuk sayısı dikkate alınır?",
                "options": [
                    "Bölgesel Demiryolu",
                    "Hafif Raylı Sistem",
                    "Tramvay",
                    "Metro",
                    "Şehir İçi Otobüs Hattı"
                ],
                "correct": "A",
                "explanation": "Bölgesel demiryolunda uzun mesafeli yolculuklar olduğu için sadece koltuk sayısı dikkate alınır.",
                "is_bonus": False
            },
            {
                "question": "Aşağıda verilen sürelerden hangisi toplu ulaşım hattı işletmesi için iş gücü gereksinimlerinin hesaplanmasında net çalışma süresini temsil eder?",
                "options": [
                    "Tam Tur Süresi",
                    "Hattaki Yolculuk Süresi",
                    "Aracın Yolcu Taşımadığı Süre",
                    "Peron Süresi",
                    "Aktarma Süresi"
                ],
                "correct": "D",
                "explanation": "Peron Süresi, iş gücü gereksinimlerinin hesaplanmasında net çalışma süresini temsil eder.",
                "is_bonus": False
            },
            {
                "question": "Düzenli işletme için gerekli araçlar, yedekte bekleyen araçlar, bakım ve onarımda bekleyen araçlar toplamı aşağıda verilen hangi bileşeni meydana getirir?",
                "options": [
                    "Filoların Araç İçi Kapasitesi",
                    "Yolcu Akımı",
                    "Filo Kullanım Faktörü",
                    "Toplu Taşıma Birimleri",
                    "Filo Büyüklüğü"
                ],
                "correct": "E",
                "explanation": "Tüm araçların toplamı Filo Büyüklüğünü oluşturur.",
                "is_bonus": False
            },
            {
                "question": "Toplu ulaşım hattında gerekli ulaşım kapasitesinin planlanmasında kullanılan en önemli faktör hangisidir?",
                "options": [
                    "A(s) – İnişlerin Kümülatif Toplamı",
                    "C – Sunulan Kapasite",
                    "P(max) – Maksimum Yolcu Hacmi",
                    "Filo Kullanım Faktörü",
                    "B(s) – Binişlerin Kümülatif Toplamı"
                ],
                "correct": "C",
                "explanation": "Maksimum Yolcu Hacmi, kapasite planlamasında en önemli faktördür.",
                "is_bonus": False
            },
            {
                "question": "Minimum sefer aralığının belirlenmesinde hangi bileşenler kullanılmaktadır?",
                "options": [
                    "Gerçekleşen Kapasite, Sunulan Kapasite",
                    "Yön Sefer Aralığı, İstasyon Sefer Aralığı",
                    "İlkesel Sefer Aralığı, Sefer Sıklığı",
                    "Filo Kullanım Faktörü, Toplu Ulaşım Hat Kapasitesi",
                    "İstasyon Sefer Aralığı, Araç Kapasitesi"
                ],
                "correct": "A",
                "explanation": "Gerçekleşen Kapasite ve Sunulan Kapasite, minimum sefer aralığının belirlenmesinde kullanılır.",
                "is_bonus": False
            },
            {
                "question": "Aşağıda gösterilen raylı ulaşım hattı şemasına göre bağlantılar dikkate alınarak toplam hat uzunluğu ve ağ uzunluğu değerlerini hesaplayınız.\n(Her bağlantı uzunluğu: AB = BC = CD = DE = FI = IK = KL = LM = NP = PR = ST = 3 km;\nEF, FG, FH, MN, MS = 2 km;\nMD = 1 km)",
                "options": [
                    "Toplam Hat Uzunluğu = 56 km; Ağ Uzunluğu = 47 km",
                    "Toplam Hat Uzunluğu = 47 km; Ağ Uzunluğu = 39 km",
                    "Toplam Hat Uzunluğu = 50 km; Ağ Uzunluğu = 41 km",
                    "Toplam Hat Uzunluğu = 53 km; Ağ Uzunluğu = 44 km",
                    "Toplam Hat Uzunluğu = 44 km; Ağ Uzunluğu = 38 km"
                ],
                "correct": "E",
                "explanation": "Şema hesaplamasına göre Toplam Hat Uzunluğu = 44 km, Ağ Uzunluğu = 38 km",
                "is_bonus": False
            },
            {
                "question": "Bir veya birden fazla hattın hizmet verdiği tüm güzergâhların toplam uzunluğu olarak ifade edilen terim aşağıdakilerden hangisidir?",
                "options": [
                    "İstasyon Uzunluğu",
                    "Toplam Güzergâh Uzunluğu",
                    "Hat Uzunluğu",
                    "İki Durak Arası Uzunluk",
                    "Ağ Uzunluğu"
                ],
                "correct": "E",
                "explanation": "Ağ Uzunluğu, tüm güzergâhların toplam uzunluğunu ifade eder.",
                "is_bonus": False
            },
            {
                "question": "Filo kullanım faktörünün hesabı aşağıdakilerin hangisinde doğru olarak verilmiştir?\n(N = Düzenli İşletme İçin Gerekli Araçlar; Nr = Yedek Araçlar; Nf = Filo Büyüklüğü; Nm = Bakım ve Onarımda olan araçlar)",
                "options": [
                    "(N + Nr + Nf + Nm) / Nf",
                    "(Nm + Nr) / (N + Nf)",
                    "Nr + (Nf / N)",
                    "(N + Nr) / Nf",
                    "N + Nr + Nf + Nm"
                ],
                "correct": "D",
                "explanation": "Filo kullanım faktörü = (N + Nr) / Nf formülü ile hesaplanır.",
                "is_bonus": False
            },
            {
                "question": "Çoğu potansiyel toplu ulaşım kullanıcısının aşağıdaki seçeneklerden hangisinin gerçekleşmesi durumunda sistemi kullanmaya daha fazla istekli olacağı düşünülebilir?",
                "options": [
                    "Toplu ulaşım sisteminin hizmet kalitesinin yüksek olması",
                    "Potansiyel yolcuların yürüme, bisiklet ve otobüsle sisteme erişiminin olması",
                    "Toplu ulaşım sisteminin 10 dk'lık yürüme mesafesinde (800 m) ulaşılabilir olması",
                    "Toplu ulaşım sisteminin 5 dk'lık yürüme mesafesinde (400 m) ulaşılabilir olması",
                    "Özel araçla erişim gibi besleme modlarının kullanılabilir olması"
                ],
                "correct": "C",
                "explanation": "10 dakikalık yürüme mesafesi (800 m) kabul edilebilir bir erişim mesafesidir.",
                "is_bonus": False
            },
            {
                "question": "Aşağıdakilerden hangisi besleme hatların kılçık hatlara göre avantajlarından değildir?",
                "options": [
                    "Filo boyutu daha küçüktür ve işletme maliyetleri düşüktür.",
                    "Ağ içerisinde daha fazla bağlantı sağlayarak besleme hatlar arasında da aktarma olanağı sunar.",
                    "Düzenli sefer aralıkları ana hatta ve her bir besleme hattında uygulanabilir.",
                    "Ana hatta ve besleme hatlar arasında gecikmeler daha düşük ihtimaldedir.",
                    "Aktarma istasyonlarına ihtiyaç duyulmaz."
                ],
                "correct": "B",
                "explanation": "Besleme hatları arasında aktarma olanağı sunması avantajdır, dezavantaj değildir.",
                "is_bonus": False
            },
            {
                "question": "Tüneller ve köprüler ile toplu ulaşım geçişlerine en uzun ve en büyük örnek hangisidir?",
                "options": [
                    "Avrasya Tüneli",
                    "Zigana Tüneli",
                    "Ovit Tüneli",
                    "Manş Tüneli",
                    "Marmaray Tüneli"
                ],
                "correct": "D",
                "explanation": "Manş Tüneli, toplu ulaşım geçişlerine en uzun ve en büyük örnektir.",
                "is_bonus": False
            },
            {
                "question": "Besleme hattı olan hafif raylı sistem hatları kendi içlerinde hangi toplu ulaşım hattı türündedir?",
                "options": [
                    "Döngüsel Hat",
                    "Radyal Hat",
                    "Teğet Hat",
                    "Çapsal Hat",
                    "Çevresel Hat"
                ],
                "correct": "B",
                "explanation": "Besleme hattı olan hafif raylı sistemler Radyal Hat türündedir.",
                "is_bonus": False
            },
            {
                "question": "Toplu ulaşım sistemini tasarlamada baskın olan hedef aşağıdakilerden hangisidir?",
                "options": [
                    "Yüksek yaşam kalitesi oluşturmak",
                    "Şehrin ihtiyaçlarını karşılamak",
                    "Arzu edilen arazi kullanım modellerini gerçekleştirmek",
                    "Mümkün olduğunca çok yolcu çekmek",
                    "Sürdürülebilir ulaşım modelleri geliştirmek"
                ],
                "correct": "D",
                "explanation": "Toplu ulaşım sisteminin ana hedefi mümkün olduğunca çok yolcu çekmektir.",
                "is_bonus": False
            },
            {
                "question": "I. Duraklar\nII. Ağ\nIII. Araç konfigürasyonları\nIV. İstasyonlar\nYukarıda verilenlerden hangisi ya da hangileri toplu ulaşım sisteminin ana altyapı bileşenlerini oluşturur?",
                "options": [
                    "Yalnız III",
                    "Yalnız II",
                    "Yalnız IV",
                    "III ve IV",
                    "I, II ve IV"
                ],
                "correct": "E",
                "explanation": "Duraklar, Ağ ve İstasyonlar ana altyapı bileşenlerini oluşturur.",
                "is_bonus": False
            },
            {
                "question": "C sınıfı yol kullanım hakkı olan, istenildiği zaman kolayca değiştirilebilen hatlar aşağıdakilerden hangisidir?",
                "options": [
                    "Metro hatları",
                    "Troleybüs hatları",
                    "Cadde tramvayı hatları",
                    "Hafif raylı sistem hatları",
                    "Otobüs hatları"
                ],
                "correct": "E",
                "explanation": "Otobüs hatları C sınıfı yol kullanım hakkına sahiptir ve kolayca değiştirilebilir.",
                "is_bonus": False
            },
            {
                "question": "Yayaların ve farklı erişim modlarındaki araçların rahat erişimini sağlamak amacıyla son istasyonlar nereye yerleştirilmelidir?",
                "options": [
                    "Ana caddelere yakın yere",
                    "Cep hatlarının yakınına",
                    "Kılçık hatların aktarma noktasına",
                    "Depolama alanlarının yanına",
                    "Manevra istasyonlarının yanına"
                ],
                "correct": "A",
                "explanation": "Son istasyonlar ana caddelere yakın yere yerleştirilmelidir.",
                "is_bonus": False
            },
            {
                "question": "Hızlı toplu ulaşımda (A sınıfı) yol kullanım hakkına sahip metro sistemlerinde işletme hızını belirleyen ana faktör hangisidir?",
                "options": [
                    "İstasyon aralıkları",
                    "Yolculuk mesafesi",
                    "Erişim modu",
                    "Ücret toplama sistemi",
                    "Taşıdığı yolcu sayısı"
                ],
                "correct": "A",
                "explanation": "İstasyon aralıkları, metro sistemlerinde işletme hızını belirleyen ana faktördür.",
                "is_bonus": False
            },
            {
                "question": "Dairesel hatların kullanımı genellikle çok yüksektir. Bu hatların en önemli özelliği aşağıdakilerden hangisidir?",
                "options": [
                    "Şehir merkezinden geçerek en kısa yoldan zıt yönlerdeki banliyölere bağlanırlar.",
                    "Bazı toplu taşıma birimleri merkezden sadece orta noktalara işler ve sonra geri döner.",
                    "Bunlar merkezden dışarı doğru azalan yolcu hacmine sahiptir.",
                    "Kısa yolculuklara hizmet ederler ve yolcu gelirleri yüksektir.",
                    "Bunlar merkezi alan içinden geçen radyal yönleri izler."
                ],
                "correct": "E",
                "explanation": "Dairesel hatlar merkezi alan içinden geçen radyal yönleri izler.",
                "is_bonus": True
            },
            {
                "question": "Bazı metro sistemlerinde, özellikle hafta sonları ve akşam/gece saatlerinde yolcu talebi uzun süreler boyunca düşüktür. Böyle durumlarda çok kısa trenler işletilerek aşağıdaki avantajlardan hangisi sağlanır?",
                "options": [
                    "Düşük işletme maliyetleri",
                    "Güvenli takip mesafesi",
                    "Yolcu memnuniyeti",
                    "Daha az yatırım maliyetleri",
                    "Yüksek sistem performansı"
                ],
                "correct": "A",
                "explanation": "Kısa trenler işletilerek düşük işletme maliyetleri sağlanır.",
                "is_bonus": True
            }
        ]
        self.score = 0
        self.total_questions = len(self.questions)
        self.current_question = 0
        self.answers = []
        self.points_per_question = 4
        self.max_score = 100  # 25 soru x 4 puan = 100

    def display_question(self, question_data, shuffled_options):
        print(f"\n{'='*60}")
        print(f"SORU {self.current_question + 1}/{self.total_questions}")
        print(f"{'='*60}")
        
        if question_data['is_bonus']:
            print(f"🎁 EK SORU (Puan eklemez)")
        else:
            print(f"📝 NORMAL SORU ({self.points_per_question} puan)")
        
        print(f"Puanınız: {self.score}/{self.max_score}")
        print(f"{'='*60}")
        print(f"\n{question_data['question']}")
        print()
        
        for i, option in enumerate(shuffled_options):
            print(f"{chr(65+i)}) {option}")
        print()

    def get_user_answer(self):
        while True:
            answer = input("Cevabınızı girin (A/B/C/D/E): ").upper().strip()
            if answer in ['A', 'B', 'C', 'D', 'E']:
                return answer
            else:
                print("Lütfen A, B, C, D veya E girin!")

    def check_answer(self, user_answer, correct_letter, explanation, is_bonus):
        if user_answer == correct_letter:
            if not is_bonus:
                self.score += self.points_per_question
                print(f"\n✅ DOĞRU! +{self.points_per_question} puan")
            else:
                print(f"\n✅ DOĞRU! (Ek soru - puan eklenmez)")
            print(f"📝 Açıklama: {explanation}")
        else:
            print(f"\n❌ YANLIŞ!")
            print(f"🔍 Doğru cevap: {correct_letter}")
            print(f"📝 Açıklama: {explanation}")
        
        self.answers.append({
            'question': self.current_question + 1,
            'user_answer': user_answer,
            'correct_answer': correct_letter,
            'is_correct': user_answer == correct_letter,
            'is_bonus': is_bonus
        })

    def show_final_results(self):
        print(f"\n{'='*60}")
        print("🎯 SINAV SONUÇLARI")
        print(f"{'='*60}")
        print(f"Toplam Soru: {self.total_questions} (25 normal + 2 ek soru)")
        print(f"Normal Sorular: 25 soru x {self.points_per_question} puan = 100 puan")
        print(f"Ek Sorular: 2 soru (puan eklemez)")
        print(f"Alınan Puan: {self.score}/{self.max_score}")
        print(f"Başarı Yüzdesi: %{(self.score/self.max_score)*100:.1f}")
        
        if self.score >= 80:
            print("🏆 MÜKEMMEL! Çok iyi çalışmışsınız!")
        elif self.score >= 60:
            print("👍 İYİ! Biraz daha çalışmanız gerekiyor.")
        else:
            print("📚 ÇALIŞMANIZ GEREKİYOR! Daha fazla tekrar yapın.")
        
        print(f"\n{'='*60}")
        print("📊 DETAYLI SONUÇLAR")
        print(f"{'='*60}")
        
        for answer in self.answers:
            status = "✅" if answer['is_correct'] else "❌"
            bonus_text = " (EK SORU)" if answer['is_bonus'] else ""
            print(f"Soru {answer['question']}: {status} (Sizin: {answer['user_answer']}, Doğru: {answer['correct_answer']}){bonus_text}")

    def run_quiz(self):
        print("🚇 TOPLU ULAŞIM SİSTEMLERİ QUIZ")
        print("="*60)
        print("2 Temmuz sınavınıza hazırlık için hazırlanmıştır!")
        print("="*60)
        print("📝 Her normal soru 4 puan değerindedir")
        print("🎁 2 ek soru puan eklemez")
        print("🏆 Maksimum puan: 100")
        print("="*60)
        
        input("\nBaşlamak için ENTER'a basın...")
        
        # Soruları karıştır
        random.shuffle(self.questions)
        
        for i, question_data in enumerate(self.questions):
            self.current_question = i
            # Şıkları karıştır
            options = question_data['options'][:]
            correct_index = ord(question_data['correct']) - 65
            correct_option = options[correct_index]
            shuffled_options = options[:]
            random.shuffle(shuffled_options)
            # Doğru cevabın yeni harfini bul
            new_correct_index = shuffled_options.index(correct_option)
            correct_letter = chr(65 + new_correct_index)

            self.display_question(question_data, shuffled_options)
            user_answer = self.get_user_answer()
            self.check_answer(user_answer, correct_letter, question_data['explanation'], question_data['is_bonus'])
            
            if i < len(self.questions) - 1:
                input("\nSonraki soru için ENTER'a basın...")
        
        self.show_final_results()
        
        # Sonuçları kaydet
        with open('quiz_results.txt', 'a', encoding='utf-8') as f:
            f.write(f"Quiz Sonuçları - {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Toplam Soru: {self.total_questions} (25 normal + 2 ek soru)\n")
            f.write(f"Alınan Puan: {self.score}/{self.max_score}\n")
            f.write(f"Başarı Yüzdesi: %{(self.score/self.max_score)*100:.1f}\n\n")
            
            for answer in self.answers:
                status = "DOĞRU" if answer['is_correct'] else "YANLIŞ"
                bonus_text = " (EK SORU)" if answer['is_bonus'] else ""
                f.write(f"Soru {answer['question']}: {status} (Sizin: {answer['user_answer']}, Doğru: {answer['correct_answer']}){bonus_text}\n")
            f.write("\n" + "-"*60 + "\n\n")

if __name__ == "__main__":
    quiz = QuizSystem()
    quiz.run_quiz() 