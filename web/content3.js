// Klipper Öğren — ders içeriği (Ünite 10-15)
// Kaynak: Installation, FAQ, Slicers, CANBUS, RPi_microcontroller, Config_Reference,
// G-Codes ve Klipper kaynak kodundaki hata mesajları (klippy/extras/error_mcu.py, homing.py).
// "log" alanı: soruda Mainsail/Fluidd konsolu gibi gösterilen çıktı.
window.KLIPPER_UNITS = window.KLIPPER_UNITS || [];
window.KLIPPER_UNITS.push(
{
  id: 'u10', title: 'Kurulum ve Güncelleme', desc: 'Firmware derle, karta yükle, güncel tut', color: '#06b6d4', icon: '🧰',
  lessons: [
  {
    id: 'u10l1', title: 'Firmware derleme', doc: 'Installation.html#building-and-flashing-the-micro-controller',
    teach: [
      { title: 'make menuconfig', body: 'MCU\'ya giden Klipper kodu host üzerinde derlenir. Hangi çip, hangi kristal, USB mi UART mı CAN mı gibi seçimler **make menuconfig** ekranında yapılır. Doğru ayarlar genelde örnek printer.cfg dosyasının **en üstündeki yorumlarda** yazar.\n\nÇıkarken **Q**, kaydetmek için **Y**. Sonra **make**.', code: 'cd ~/klipper/\nmake menuconfig\nmake' },
      { title: 'Karta yükleme', body: 'Kartın seri port adını bul, sonra yükle:', code: 'ls /dev/serial/by-id/*\n\nsudo service klipper stop\nmake flash FLASH_DEVICE=/dev/serial/by-id/usb-1a86_USB2.0-Serial-if00-port0\nsudo service klipper start' },
      { title: 'SD kartla yükleme', body: 'STM32 ve LPC kartların çoğu ilk seferde **SD kartla** yüklenir:\n• Yüklerken kartı USB ile host\'a **bağlama** (bazı kartlar USB\'den beslenip yüklemeyi bozar).\n• Bazı kartlar dosyayı yükleyince **firmware.cur** yapar. Bazı stok kartlar ise her seferinde **farklı dosya adı** ister (firmware1.bin, firmware2.bin).\n• RP2040 için: **make flash FLASH_DEVICE=first**, kart boot modunda olmalı.' }
    ],
    questions: [
      { t: 'mc', q: 'MCU için hangi çip ve haberleşme yolu seçileceği nerede ayarlanır?', o: ['make menuconfig', 'printer.cfg [mcu] bölümü', 'Mainsail ayarları', 'moonraker.conf'], a: 0, e: 'Derleme seçenekleri make menuconfig\'te seçilir; printer.cfg sadece host tarafını ayarlar.' },
      { t: 'mc', q: 'Doğru menuconfig ayarlarını en hızlı nerede bulursun?', o: ['Örnek printer.cfg\'nin en üstündeki yorumlarda', 'Kartın kutusunda', 'klippy.log\'da', 'Dilimleyicide'], a: 0, e: 'Klipper\'ın config klasöründeki printer-*.cfg dosyalarının başında gerekli menuconfig ayarları yazar.' },
      { t: 'order', q: 'USB üzerinden firmware yükleme sırası', items: ['make menuconfig', 'make', 'sudo service klipper stop', 'make flash FLASH_DEVICE=...', 'sudo service klipper start'], e: 'Yüklerken Klipper servisini durdurursun ki seri portu kullanmasın.' },
      { t: 'type', q: 'Bağlı kartların kalıcı seri port adlarını listeleyen komutu yaz', a: ['ls /dev/serial/by-id/*', 'ls /dev/serial/by-id', 'ls /dev/serial/by-id/'], e: 'by-id adları kart yeniden başlasa da değişmez.' },
      { t: 'tf', q: 'Kartı SD kartla yüklerken USB kablosunun da host\'a takılı olması önerilir.', a: false, e: 'Tersine: bazı kartlar USB\'den beslenip yüklemenin olmasını engelleyebilir. SD ile yüklerken USB\'yi çıkar.' },
      { t: 'mc', q: 'SD karttan yükledin; kart firmware.bin dosyasının adını değiştirdi. Bu ne demek?', o: ['Yükleme başarılı, dosya firmware.cur oldu', 'Dosya bozuk', 'Kart Marlin\'e döndü', 'SD kart yanlış formatlı'], a: 0, e: 'Birçok kart yüklediği dosyayı firmware.cur yapar ki her açılışta tekrar yüklemesin.' },
      { t: 'mc', q: 'Stok bir kart aynı firmware.bin adıyla yeni sürümü yüklemiyor. Çözüm?', o: ['Dosyaya her seferinde farklı ad ver (firmware2.bin gibi)', 'make clean yapmak yeter', 'Kartı formatla', 'Baud\'u değiştir'], a: 0, e: 'Bazı stok kartlar aynı adı görünce yüklemeyi atlar.' },
      { t: 'fill', q: 'RP2040 kartı yükle', code: 'make flash FLASH_DEVICE=___', o: ['first', 'rp2040', 'usb', 'auto'], a: 'first', e: 'RP2040\'ta FLASH_DEVICE=first kullanılır; kart boot modunda olmalı.' }
    ]
  },
  {
    id: 'u10l2', title: 'Host ve ilk ayar', doc: 'Installation.html',
    teach: [
      { title: 'Host tarafı', body: 'Klipper\'ı genelde bir **SBC** (Raspberry Pi gibi küçük bilgisayar) çalıştırır.\n\n• **Moonraker**: Klipper\'ın web API\'si. **Mainsail** ve **Fluidd** bunun üzerinden konuşur.\n• **MainsailOS**: hazır Raspberry Pi imajı.\n• **KIAUH**: Klipper, Moonraker, arayüz kurmak için 3. parti kurulum aracı.\n• Masaüstü (desktop) Linux sürümleri önerilmez.' },
      { title: 'printer.cfg\'yi başlatmak', body: 'Klipper\'ın **config** klasöründe hazır dosyalar var:\n• **printer-…** → belirli yazıcılar\n• **generic-…** → sadece kart biliniyorsa\n\n[mcu] bölümüne kartın **by-id** yolunu yaz. /dev/ttyUSB0 gibi adlar kart yeniden başlayınca ttyUSB1\'e kayabilir.', code: '[mcu]\nserial: /dev/serial/by-id/usb-1a86_USB2.0-Serial-if00-port0' }
    ],
    questions: [
      { t: 'mc', q: 'Mainsail ve Fluidd Klipper\'la hangi yazılım üzerinden konuşur?', o: ['Moonraker', 'OctoPrint', 'KIAUH', 'Cura'], a: 0, e: 'Moonraker, Klipper\'ın web API katmanıdır.' },
      { t: 'mc', q: 'KIAUH nedir?', o: ['Klipper ve çevresini kuran 3. parti kurulum aracı', 'Bir anakart modeli', 'Bir dilimleyici', 'Klipper\'ın resmi arayüzü'], a: 0, e: 'Klipper Install And Update Helper; Klipper, Moonraker, Mainsail/Fluidd kurar.' },
      { t: 'mc', q: 'Yazıcın için hazır config yok, sadece kartın modeli belli. Hangi dosyadan başlarsın?', o: ['generic-<kart>.cfg', 'printer-<yazıcı>.cfg', 'example-delta.cfg', 'Boş dosya'], a: 0, e: 'generic- dosyaları karta göre başlangıç sağlar; sonra yazıcına göre düzenlenir.' },
      { t: 'tf', q: '[mcu] serial ayarında /dev/serial/by-id/... yolu kullanmak, /dev/ttyUSB0 kullanmaktan daha güvenlidir.', a: true, e: 'ttyUSB0 kart resetlenince ttyUSB1\'e kayabilir; by-id adı sabittir.' },
      { t: 'tf', q: 'Klipper host\'u için masaüstü (desktop) Linux sürümü kullanmak önerilir.', a: false, e: 'Doküman masaüstü sürümlerini önermiyor; bazı yardımcı programlar Klipper\'ın karta erişimini bozabiliyor.' },
      { t: 'fill', q: 'Kartın seri portunu tanımla', code: '[mcu]\n___: /dev/serial/by-id/usb-Klipper_stm32f446xx-if00', o: ['serial', 'port', 'device', 'path'], a: 'serial', e: '[mcu] bölümünde serial: ayarı kullanılır.' },
      { t: 'mc', q: 'Firmware yükledikten sonra by-id adı değişti. Ne yaparsın?', o: ['ls /dev/serial/by-id/* ile yeni adı alıp [mcu] serial\'ı güncellersin', 'Hiçbir şey, Klipper bulur', 'Kartı geri Marlin yaparsın', 'Baud\'u 115200 yaparsın'], a: 0, e: 'Doküman, yüklemeden sonra adın değişebileceğini ve tekrar bakmayı söylüyor.' }
    ]
  },
  {
    id: 'u10l3', title: 'Güncelleme', doc: 'FAQ.html#how-do-i-upgrade-to-the-latest-software',
    teach: [
      { title: 'Önce oku, sonra güncelle', body: 'Güncellemeden önce **Config_Changes** belgesine bak: bazen ayar adları değişir. (Uygulamadaki **Yenilikler** sekmesi tam olarak bunu gösterir.)\n\nSadece host güncellenecekse:', code: 'cd ~/klipper\ngit pull\nsudo service klipper restart' },
      { title: 'MCU da güncellenmeli mi?', body: 'Klipper "MCU\'yu yeniden yükle" diye uyarırsa ya da **protokol hatası** verirse, MCU\'daki firmware eskidir: tekrar derle ve yükle.\n\n⚠️ RESTART ve FIRMWARE_RESTART **yeni yazılım yüklemez**; sadece yeniden başlatır.', code: 'make menuconfig\nmake clean\nmake\nsudo service klipper stop\nmake flash FLASH_DEVICE=/dev/serial/by-id/...\nsudo service klipper start' }
    ],
    questions: [
      { t: 'mc', q: 'Klipper\'ı güncellemeden önce hangi belgeye bakmalısın?', o: ['Config_Changes', 'Benchmarks', 'Contact', 'Sponsors'], a: 0, e: 'Geriye uyumsuz ayar değişiklikleri orada yazar.' },
      { t: 'order', q: 'Sadece host yazılımını güncelle', items: ['cd ~/klipper', 'git pull', 'sudo service klipper restart'], e: 'MCU kodu değişmediyse bu kısa yol yeterli.' },
      { t: 'tf', q: 'FIRMWARE_RESTART komutu Klipper\'ın yeni sürümünü yükler.', a: false, e: 'Hayır. Yeni yazılım için git pull + servis restart, MCU için make flash gerekir.' },
      { t: 'mc', q: 'Güncellemeden sonra protokol hatası geldi: "frequently caused by running an older version of the firmware". Ne yaparsın?', o: ['MCU firmware\'ini yeniden derleyip yüklersin', 'printer.cfg\'yi silersin', 'Mainsail\'i kaldırırsın', 'RESTART yeter'], a: 0, e: 'Host yeni, MCU eski kaldıysa protokoller uyuşmaz. Klipper bu mesajla tekrar yüklemeni ister.' },
      { t: 'mc', q: 'Derlemeden önce make clean ne işe yarar?', o: ['Önceki derleme dosyalarını siler, temiz derleme sağlar', 'Kartı sıfırlar', 'printer.cfg\'yi temizler', 'Logları siler'], a: 0, e: 'FAQ\'daki tam güncelleme adımlarında make clean yer alır.' },
      { t: 'type', q: 'Klipper servisini yeniden başlatan komutu yaz', a: ['sudo service klipper restart', 'sudo systemctl restart klipper'], e: 'sudo service klipper restart (systemctl ile de olur).' }
    ]
  }
  ]
},
{
  id: 'u11', title: 'Dilimleyici ve Arayüz', desc: 'START_PRINT, slicer ayarları, Mainsail', color: '#8b5cf6', icon: '🖥️',
  lessons: [
  {
    id: 'u11l1', title: 'Dilimleyici ayarları', doc: 'Slicers.html',
    teach: [
      { title: 'Klipper ile dilimleyici', body: '• G-code flavor: **Marlin** seç (Smoothieware da çalışır).\n• Başlangıç/bitiş kodlarını dilimleyiciye uzun uzun yazma. Klipper\'da **START_PRINT** ve **END_PRINT** makrosu yaz, dilimleyiciye sadece bunları koy. Değişiklik için tekrar dilimlemen gerekmez.\n• **Coasting** açma, "advanced extruder pressure" ayarlarını kapat. Yerine **pressure advance** kullan.' },
      { title: 'Parametre göndermek', body: 'Sıcaklıkları dilimleyiciden makroya gönderirsin:', code: '; PrusaSlicer / OrcaSlicer\nSTART_PRINT BED_TEMP=[first_layer_bed_temperature] EXTRUDER_TEMP=[first_layer_temperature]\n\n; Cura\nSTART_PRINT BED_TEMP={material_bed_temperature_layer_0} EXTRUDER_TEMP={material_print_temperature_layer_0}' }
    ],
    questions: [
      { t: 'mc', q: 'Klipper için dilimleyicide hangi G-code flavor seçilir?', o: ['Marlin', 'RepRapFirmware', 'Makerbot', 'Mach3'], a: 0, e: 'Doküman Marlin\'i öneriyor; Smoothieware da çalışır.' },
      { t: 'tf', q: 'Başlangıç kodlarını Klipper\'da START_PRINT makrosuna koymak, değişiklikte tekrar dilimleme ihtiyacını ortadan kaldırır.', a: true, e: 'Makroyu değiştirip RESTART vermen yeter.' },
      { t: 'mc', q: 'Dilimleyicideki "coasting" özelliği için doküman ne diyor?', o: ['Açma; yerine pressure advance kullan', 'Mutlaka aç', 'Sadece PETG\'de aç', 'Klipper\'da zorunlu'], a: 0, e: 'Coasting Klipper\'da baskı kalitesini bozar.' },
      { t: 'fill', q: 'PrusaSlicer başlangıç kodu', code: 'START_PRINT BED_TEMP=___', o: ['[first_layer_bed_temperature]', '{bed}', '$BED', 'S60'], a: '[first_layer_bed_temperature]', e: 'PrusaSlicer/OrcaSlicer köşeli parantezli yer tutucular kullanır.' },
      { t: 'mc', q: 'Dilimleyicide 6 mm retraction ayarladın, geri çekmeler yavaş kalıyor. Klipper\'da hangi ayara bakılır?', o: ['max_extrude_only_velocity ve max_extrude_only_accel', 'max_velocity', 'square_corner_velocity', 'homing_speed'], a: 0, e: 'Sadece-ekstrüzyon hareketlerinin hız/ivme sınırları bunlar. Ama önce pressure advance ile retraction\'ı azaltmayı düşün.' },
      { t: 'mc', q: 'Mainsail\'de katman sayısını görmek için dilimleyicinin katman değişimi koduna ne eklenir?', o: ['SET_PRINT_STATS_INFO CURRENT_LAYER={layer_num + 1}', 'M117 katman', 'LAYER_CHANGE', 'G92 L1'], a: 0, e: 'SET_PRINT_STATS_INFO ile TOTAL_LAYER ve CURRENT_LAYER Klipper\'a bildirilir.' }
    ]
  },
  {
    id: 'u11l2', title: 'START_PRINT yazmak', doc: 'Slicers.html#klipper-gcode_macro',
    teach: [
      { title: 'Tipik bir START_PRINT', body: 'Sıcaklıklar parametreyle gelir, sıra önemlidir:', code: '[gcode_macro START_PRINT]\ngcode:\n  {% set BED = params.BED_TEMP|default(60)|float %}\n  {% set EXT = params.EXTRUDER_TEMP|default(200)|float %}\n  CLEAR_PAUSE\n  M140 S{BED}\n  G28\n  M190 S{BED}\n  BED_MESH_CALIBRATE ADAPTIVE=1\n  M109 S{EXT}\n  G92 E0' },
      { title: 'END_PRINT', body: 'Bitince filamanı biraz geri çek, kafayı kaldır, ısıtıcıları ve fanı kapat, motorları bırak, mesh\'i temizle.', code: '[gcode_macro END_PRINT]\ngcode:\n  G91\n  G1 E-2 F2700\n  G1 Z10 F600\n  G90\n  TURN_OFF_HEATERS\n  M107\n  M84\n  BED_MESH_CLEAR' }
    ],
    questions: [
      { t: 'order', q: 'START_PRINT içinde mantıklı sıra', items: ['M140 S{BED}', 'G28', 'M190 S{BED}', 'BED_MESH_CALIBRATE', 'M109 S{EXT}'], e: 'Tabla ısınmaya başlarken home et; mesh\'i tabla ısındıktan sonra al (genleşme), nozulu en son ısıt ki sızmasın.' },
      { t: 'mc', q: 'Mesh neden tabla ısındıktan SONRA alınır?', o: ['Tabla ısınınca şekli biraz değişir', 'Probe soğukta çalışmaz', 'Klipper zorunlu tutar', 'Daha hızlı olduğu için'], a: 0, e: 'Isıl genleşme tablanın yüzeyini değiştirir; baskı sıcaklığında ölçmek gerekir.' },
      { t: 'mc', q: 'START_PRINT\'in başına CLEAR_PAUSE koymanın amacı?', o: ['Önceki baskıdan kalan pause durumunu temizlemek', 'Baskıyı duraklatmak', 'Fanı kapatmak', 'Mesh\'i silmek'], a: 0, e: 'Doküman bunu başlangıç koduna koymayı öneriyor.' },
      { t: 'tf', q: 'Dilimleyiciden BED_TEMP=60 gelirse makroda params.BED_TEMP metin olarak gelir; hesap için |float gerekir.', a: true, e: 'Parametreler her zaman string gelir.' },
      { t: 'match', q: 'END_PRINT satırlarını işleriyle eşleştir', pairs: [['TURN_OFF_HEATERS', 'Isıtıcıları kapat'], ['M107', 'Parça fanını kapat'], ['M84', 'Motorları bırak'], ['BED_MESH_CLEAR', 'Mesh\'i kapat']], e: 'Hepsi tipik bitiş adımları.' },
      { t: 'mc', q: 'END_PRINT\'te G1 Z10 öncesinde neden G91 kullanılır?', o: ['Bulunduğu yükseklikten 10 mm daha kalksın diye', 'Z=10 noktasına inmesin diye fark etmez', 'Fanı açmak için', 'Home yapmak için'], a: 0, e: 'Mutlak modda Z10 uzun bir baskıda nozulu aşağı, parçaya doğru götürebilir.' }
    ]
  },
  {
    id: 'u11l3', title: 'Moonraker ve Mainsail', doc: 'Installation.html#interacting-with-klipper',
    teach: [
      { title: 'Arayüz katmanı', body: '• **Klipper**: yazıcıyı sürer.\n• **Moonraker**: Klipper\'ın web API\'si. Ayarı **moonraker.conf** dosyasındadır. Güncelleme yöneticisi (update manager) Klipper\'ı ve arayüzü arayüzden güncellemeni sağlar.\n• **Mainsail / Fluidd**: tarayıcı arayüzü.\n• **OctoPrint** da Klipper\'la çalışabilir.' },
      { title: 'Arayüzün istediği bölümler', body: 'Dosya yükleyip basmak, duraklatmak ve ilerlemeyi göstermek için printer.cfg\'de şunlar olmalı:', code: '[virtual_sdcard]\npath: ~/printer_data/gcodes\n\n[pause_resume]\n\n[display_status]\n\n[exclude_object]' }
    ],
    questions: [
      { t: 'mc', q: 'Moonraker\'ın ayar dosyasının adı?', o: ['moonraker.conf', 'printer.cfg', 'mainsail.json', 'klippy.log'], a: 0, e: 'Moonraker kendi ayarlarını moonraker.conf\'ta tutar.' },
      { t: 'mc', q: 'Mainsail\'den G-code dosyası basabilmek için hangi bölüm şart?', o: ['[virtual_sdcard]', '[bed_mesh]', '[input_shaper]', '[force_move]'], a: 0, e: 'virtual_sdcard, host\'taki dosyaları basmayı sağlar.' },
      { t: 'tf', q: 'OctoPrint de Klipper ile kullanılabilir.', a: true, e: 'Doküman Moonraker tabanlı arayüzleri ve OctoPrint\'i seçenek olarak sayıyor.' },
      { t: 'mc', q: 'Mainsail\'de tek bir parçayı iptal etme butonunun çalışması için ne gerekir?', o: ['[exclude_object] ve dilimleyicide nesne etiketleme (label objects)', '[pause_resume]', '[skew_correction]', '[save_variables]'], a: 0, e: 'Dilimleyici G-code\'a nesne adlarını yazmalı; Klipper da exclude_object ile bunları tanımalı.' },
      { t: 'match', q: 'Eşleştir', pairs: [['Klipper', 'Yazıcıyı sürer'], ['Moonraker', 'Web API'], ['Mainsail', 'Tarayıcı arayüzü'], ['KIAUH', 'Kurulum aracı']], e: 'Katmanlar ayrı ayrı güncellenebilir.' }
    ]
  }
  ]
},
{
  id: 'u12', title: 'Fanlar, LED, Sensörler', desc: 'Her fan tipi, neopixel, filaman sensörü', color: '#0ea5e9', icon: '🌀',
  lessons: [
  {
    id: 'u12l1', title: 'Fan tipleri', doc: 'Config_Reference.html#fan',
    teach: [
      { title: 'Hangi fan, hangi bölüm?', body: '• **[fan]**: parça soğutma fanı, M106/M107 ile yönetilir.\n• **[heater_fan …]**: hotend ısıtıcısı açıkken çalışır. Isıtıcı **heater_temp** (varsayılan **50 °C**) altına inene kadar dönmeye devam eder.\n• **[controller_fan …]**: motor sürücüleri veya ısıtıcı aktifken kart fanını çalıştırır.\n• **[temperature_fan …]**: bir sensör hedefi (varsayılan **40 °C**) aşınca çalışır.\n• **[fan_generic …]**: elle kontrol, **SET_FAN_SPEED FAN=… SPEED=…**' },
      { title: 'Ortak ayarlar', body: '• **max_power**: en fazla güç (0-1)\n• **kick_start_time** (0.100 sn): fan ilk dönerken kısa süre tam güç\n• **off_below**: bu hızın altındaki istekler fanı kapatır (durma-kalkma sorununa karşı)\n• **hardware_pwm**: donanım PWM', code: '[heater_fan hotend_fan]\npin: PB15\nheater: extruder\nheater_temp: 50.0' }
    ],
    questions: [
      { t: 'mc', q: 'Hotend soğutma fanı (heatbreak fanı) için hangi bölüm?', o: ['[heater_fan …]', '[fan]', '[fan_generic …]', '[output_pin …]'], a: 0, e: 'heater_fan, bağlı olduğu ısıtıcı açıkken otomatik çalışır.' },
      { t: 'mc', q: 'Baskı bitti, ısıtıcı kapandı; hotend fanı hâlâ dönüyor. Neden?', o: ['Nozul heater_temp (50 °C) altına inene kadar çalışır', 'Arıza var', 'M107 verilmemiş', 'Fan ters bağlı'], a: 0, e: 'Isı yukarı sızmasın diye sıcaklık düşene kadar döner; bu normal.' },
      { t: 'mc', q: 'Kartın sürücülerini soğutan, motorlar aktifken çalışan fan?', o: ['[controller_fan …]', '[heater_fan …]', '[temperature_fan …]', '[fan]'], a: 0, e: 'controller_fan sürücü veya ısıtıcı aktifken çalışır, idle_timeout sonrası durur.' },
      { t: 'fill', q: 'Elle kontrol edilen yardımcı fanı %50 yap', code: '___ FAN=aux SPEED=0.5', o: ['SET_FAN_SPEED', 'M106', 'SET_PIN', 'FAN_SPEED'], a: 'SET_FAN_SPEED', e: 'fan_generic için SET_FAN_SPEED kullanılır; hız 0.0-1.0 arası.' },
      { t: 'mc', q: 'Kapalı kasada sıcaklık 40 °C\'yi geçince egzoz fanı açılsın. Hangi bölüm?', o: ['[temperature_fan …]', '[heater_fan …]', '[controller_fan …]', '[fan]'], a: 0, e: 'temperature_fan bir sensöre bakar; target_temp varsayılanı 40 °C.' },
      { t: 'mc', q: 'Fan düşük hızda takılıp duruyor. Hangi ayar yardımcı olur?', o: ['off_below ve kick_start_time', 'max_velocity', 'heater_temp', 'pid_Kp'], a: 0, e: 'kick_start_time fanı ilk anda tam güçle döndürür, off_below çok düşük hızları tamamen kapatır.' },
      { t: 'tf', q: 'M106/M107 komutları [fan] bölümündeki parça fanını kontrol eder.', a: true, e: 'Diğer fan tipleri kendi kurallarıyla ya da SET_FAN_SPEED ile çalışır.' }
    ]
  },
  {
    id: 'u12l2', title: 'LED ve çıkış pinleri', doc: 'G-Codes.html#led',
    teach: [
      { title: 'Neopixel', body: 'WS2812 tipi adreslenebilir LED\'ler:', code: '[neopixel kasa]\npin: PB0\nchain_count: 24\ncolor_order: GRB\n\nSET_LED LED=kasa RED=1 GREEN=0.4 BLUE=0\nSET_LED LED=kasa RED=0 GREEN=1 BLUE=0 INDEX=3' },
      { title: 'output_pin', body: 'Bir pini elle aç/kapat (röle, LED şerit, buzzer):\n• **pwm: False** → değer 0 veya 1\n• **pwm: True** → değer 0.0-1.0\n\nKomut: **SET_PIN PIN=… VALUE=…**', code: '[output_pin isik]\npin: PA8\npwm: True\n\nSET_PIN PIN=isik VALUE=0.5' }
    ],
    questions: [
      { t: 'mc', q: 'SET_LED\'de renk değerleri hangi aralıkta?', o: ['0.0 - 1.0', '0 - 255', '0 - 100', '0 - 1023'], a: 0, e: 'Klipper LED renkleri 0.0-1.0 arasıdır (M106\'daki 0-255 ile karıştırma).' },
      { t: 'mc', q: '24 LED\'lik şeritte sadece 3. LED\'i yeşil yapmak için?', o: ['SET_LED LED=kasa GREEN=1 INDEX=3', 'SET_LED LED=kasa3 GREEN=1', 'SET_LED LED=kasa GREEN=255 N=3', 'SET_PIN PIN=kasa VALUE=3'], a: 0, e: 'INDEX ile zincirdeki tek bir LED seçilir (1\'den başlar).' },
      { t: 'mc', q: 'neopixel color_order varsayılanı?', o: ['GRB', 'RGB', 'BGR', 'RGBW'], a: 0, e: 'Varsayılan GRB. Renkler karışık çıkıyorsa bu ayarı değiştir.' },
      { t: 'fill', q: 'Kasa ışığını kapat', code: 'SET_PIN PIN=isik ___=0', o: ['VALUE', 'S', 'POWER', 'STATE'], a: 'VALUE', e: 'SET_PIN PIN=… VALUE=…' },
      { t: 'tf', q: 'pwm: False olan bir output_pin\'e VALUE=0.5 vermek mantıklıdır.', a: false, e: 'PWM olmayan pin sadece 0 veya 1 alır.' },
      { t: 'mc', q: 'LED\'i baskı yokken değiştirdin ve idle timeout sıfırlandı. Bunu önleyen parametre?', o: ['SYNC=0', 'TRANSMIT=0', 'INDEX=0', 'QUIET=1'], a: 0, e: 'SYNC=0, değişikliği G-code akışıyla senkronlamadan uygular; idle timeout sıfırlanmaz.' }
    ]
  },
  {
    id: 'u12l3', title: 'Sensörler', doc: 'Config_Reference.html#filament_switch_sensor',
    teach: [
      { title: 'Ek sıcaklık sensörleri', body: 'Kasa ya da Raspberry Pi sıcaklığını göstermek için:', code: '[temperature_sensor raspberry_pi]\nsensor_type: temperature_host\n\n[temperature_sensor kasa]\nsensor_type: Generic 3950\nsensor_pin: PA3' },
      { title: 'Filaman bitti sensörü', body: '• **pause_on_runout** (varsayılan **True**): filaman bitince PAUSE.\n• **runout_gcode**: bitince çalışacak komutlar.\n• **insert_gcode**: filaman takılınca.\n• **event_delay** (3 sn): olaylar arası en az süre.\n\nKomutlar: **QUERY_FILAMENT_SENSOR SENSOR=…**, **SET_FILAMENT_SENSOR SENSOR=… ENABLE=0**', code: '[filament_switch_sensor runout]\nswitch_pin: ^PC2\npause_on_runout: True' }
    ],
    questions: [
      { t: 'mc', q: 'Raspberry Pi\'nin işlemci sıcaklığını Mainsail\'de görmek için sensor_type?', o: ['temperature_host', 'raspberry_pi', 'host_cpu', 'Generic 3950'], a: 0, e: 'temperature_host, host bilgisayarın sıcaklık dosyasını okur.' },
      { t: 'tf', q: 'filament_switch_sensor\'da pause_on_runout varsayılan olarak açıktır.', a: true, e: 'Varsayılan True: filaman bitince baskı duraklatılır ([pause_resume] gerekir).' },
      { t: 'mc', q: 'Filaman değişimi yaparken sensörü geçici kapatmak için?', o: ['SET_FILAMENT_SENSOR SENSOR=runout ENABLE=0', 'QUERY_FILAMENT_SENSOR ENABLE=0', 'M412 S0', 'SET_PIN PIN=runout VALUE=0'], a: 0, e: 'SET_FILAMENT_SENSOR ile açılıp kapatılır.' },
      { t: 'mc', q: 'Filaman takılınca otomatik yükleme makrosu çalışsın. Hangi ayar?', o: ['insert_gcode', 'runout_gcode', 'event_delay', 'pause_delay'], a: 0, e: 'insert_gcode tanımlı değilse takma algılama kapalıdır.' },
      { t: 'match', q: 'Eşleştir', pairs: [['[temperature_sensor]', 'Sadece sıcaklık gösterir'], ['[temperature_fan]', 'Sıcaklığa göre fan'], ['[heater_generic]', 'Ek ısıtıcı (kasa ısıtıcısı)'], ['[filament_switch_sensor]', 'Filaman bitti algılama']], e: 'İsimleri birbirine benzer, işleri farklı.' },
      { t: 'mc', q: 'Klipper\'da listede olmayan bir termistör için ne yapılır?', o: ['[thermistor özel_ad] bölümüyle katsayılar ya da ölçüm noktaları tanımlanır', 'Firmware yeniden derlenir', 'Kullanılamaz', 'sensor_type: custom yazılır'], a: 0, e: '[thermistor] bölümü özel termistör tanımlamayı sağlar; sonra sensor_type: özel_ad.' }
    ]
  }
  ]
},
{
  id: 'u13', title: 'Çoklu Kart ve CAN', desc: 'Kafa kartları, CAN bus, bağlantı sorunları', color: '#10b981', icon: '🔗',
  lessons: [
  {
    id: 'u13l1', title: 'Birden fazla MCU', doc: 'Config_Reference.html#mcu-my_extra_mcu',
    teach: [
      { title: 'Ek kart tanımlamak', body: 'Ek bir kart (kafa kartı, ikinci anakart) için **[mcu isim]** bölümü eklenir. O kartın pinleri **isim:PIN** şeklinde yazılır.', code: '[mcu ebb]\ncanbus_uuid: 11aa22bb33cc\n\n[extruder]\nstep_pin: ebb:PD0\nheater_pin: ebb:PB13\nsensor_pin: ebb:PA3' },
      { title: 'Raspberry Pi de MCU olabilir', body: 'Host\'u da bir MCU gibi kullanıp pinlerini (ivmeölçer, GPIO) kullanabilirsin. Bunun için Linux MCU servisi kurulur ve bağlantı **/tmp/klipper_host_mcu** üzerinden olur.', code: '[mcu rpi]\nserial: /tmp/klipper_host_mcu' }
    ],
    questions: [
      { t: 'fill', q: '"ebb" adlı kafa kartının PB13 pinini kullan', code: 'heater_pin: ___', o: ['ebb:PB13', 'PB13@ebb', 'ebb.PB13', '[ebb] PB13'], a: 'ebb:PB13', e: 'Ek MCU pinleri "mcu_adı:pin" biçiminde yazılır.' },
      { t: 'mc', q: 'İkinci bir anakart eklemek için hangi bölüm?', o: ['[mcu ikinci]', '[board ikinci]', '[mcu2]', '[extra_mcu]'], a: 0, e: '"mcu" önekiyle istediğin kadar ek MCU tanımlayabilirsin.' },
      { t: 'mc', q: 'Raspberry Pi\'yi MCU olarak eklerken serial yolu?', o: ['/tmp/klipper_host_mcu', '/dev/ttyAMA0', '/dev/serial/by-id/rpi', 'localhost'], a: 0, e: 'Linux MCU servisi /tmp/klipper_host_mcu üzerinden bağlanır.' },
      { t: 'tf', q: 'Endstop bir kartta, motor başka bir karttaysa da homing yapılabilir (multi-mcu homing).', a: true, e: 'Klipper buna "multi-mcu homing" der ve saatleri senkronize ederek yapar.' },
      { t: 'mc', q: 'Kafa kartı kullanmanın en büyük pratik faydası?', o: ['Kafaya giden kablo sayısı çok azalır', 'Baskı hızı otomatik iki katına çıkar', 'Probe gerekmez', 'Firmware güncellemesi gerekmez'], a: 0, e: 'Isıtıcı, termistör, fanlar, ekstrüder motoru kafadaki karta bağlanır; ana karta sadece CAN/güç kablosu gider.' },
      { t: 'mc', q: '/tmp/klipper_host_mcu bağlantısında "Permission denied" hatası. Çözüm?', o: ['Kullanıcıyı tty grubuna eklemek', 'Kartı yeniden yüklemek', 'CAN hızını değiştirmek', 'printer.cfg\'yi silmek'], a: 0, e: 'Doküman: sudo usermod -a -G tty pi' }
    ]
  },
  {
    id: 'u13l2', title: 'CAN bus kurulumu', doc: 'CANBUS.html',
    teach: [
      { title: 'Donanım', body: '• Klipper CAN\'i **stm32, SAME5x ve rp2040** çiplerde destekler; kartta CAN transceiver olmalı.\n• Host için **USB-CAN adaptörü** gerekir (candlelight firmware) ya da bir kart **USB to CAN bridge** modunda adaptör görevi görür.\n• Hatta **iki adet 120 Ω** sonlandırma direnci olmalı. Güç kapalıyken CANH-CANL arası **~60 Ω** ölçülmeli.' },
      { title: 'Linux tarafı ve UUID', body: '', code: '# /etc/network/interfaces.d/can0\nallow-hotplug can0\niface can0 can static\n    bitrate 1000000\n    up ip link set $IFACE txqueuelen 128\n\n# UUID bul\n~/klippy-env/bin/python ~/klipper/scripts/canbus_query.py can0\n\n[mcu ebb]\ncanbus_uuid: 11aa22bb33cc' }
    ],
    questions: [
      { t: 'mc', q: 'CAN hattında doğru sonlandırma varsa (güç kapalı) CANH-CANL arası kaç ohm ölçülür?', o: ['~60 Ω', '~120 Ω', '~0 Ω', '~240 Ω'], a: 0, e: 'İki adet 120 Ω paralel bağlı → 60 Ω.' },
      { t: 'mc', q: 'Multimetre 120 Ω gösteriyor. Ne demek?', o: ['Sadece bir sonlandırma direnci var', 'Her şey doğru', 'Kablo kopuk', 'Üç direnç var'], a: 0, e: 'Tek direnç 120 Ω gösterir; hattın diğer ucuna da direnç (jumper) gerekir.' },
      { t: 'fill', q: 'can0 ayarında hız', code: 'iface can0 can static\n    bitrate ___', o: ['1000000', '250000', '115200', '500'], a: '1000000', e: 'Dokümandaki örnek 1 Mbit (1000000). Tüm cihazlar aynı hızda olmalı.' },
      { t: 'mc', q: 'canbus_query.py yeni kafa kartını göstermiyor ama Klipper zaten ona bağlı. Neden?', o: ['Araç sadece henüz Klipper\'ın yapılandırmadığı cihazları listeler', 'Kart bozuk', 'Bitrate yanlış', 'Kart USB modunda'], a: 0, e: 'Klipper bir cihazı yapılandırınca listede artık görünmez.' },
      { t: 'tf', q: 'USB to CAN bridge modunda CAN hızı Linux\'taki bitrate ayarından değil, make menuconfig\'ten gelir.', a: true, e: 'Doküman: bridge modunda Linux\'taki hız ayarı yok sayılır.' },
      { t: 'mc', q: 'Bridge kart resetlenince can0 arayüzü kapanıyor. Hangi ayar bunu tolere eder?', o: ['allow-hotplug can0', 'auto can0', 'txqueuelen 1024', 'restart_method: command'], a: 0, e: 'Doküman FIRMWARE_RESTART/RESTART sonrası düzgün çalışması için allow-hotplug öneriyor.' },
      { t: 'type', q: 'CAN üzerindeki MCU\'yu tanımlayan ayarın adını yaz', a: ['canbus_uuid'], e: '[mcu …] bölümünde canbus_uuid: … yazılır.' }
    ]
  },
  {
    id: 'u13l3', title: 'Bağlantı sorunları', doc: 'FAQ.html#i-keep-getting-random-lost-communication-with-mcu-errors',
    teach: [
      { title: '"Lost communication with MCU"', body: 'Genelde **donanım** sorunudur:\n• Kaliteli, sıkı oturan USB kablosu\n• Raspberry Pi için iyi güç kaynağı ("under voltage" uyarısı varsa mutlaka düzelt)\n• Yazıcı güç kaynağı aşırı yüklenmesin\n• Ezilmiş, sürtünen motor/ısıtıcı kabloları\n• Yazıcının 5V\'u ile host\'un 5V\'u karışıyorsa gürültü olabilir' },
      { title: '"Unable to connect"', body: 'Klipper karta hiç bağlanamıyor:\n• [mcu] **serial** yolu yanlış ya da değişmiş (by-id\'ye bak)\n• Kartta henüz Klipper firmware\'i yok\n• CAN\'de **canbus_uuid** yanlış ya da can0 kapalı' }
    ],
    questions: [
      { t: 'mc', q: 'Baskı sırasında rastgele "Lost communication with MCU" alıyorsun. İlk şüphelenilecek?', o: ['USB kablosu ve güç kaynakları', 'PID değerleri', 'Pressure advance', 'Bed mesh'], a: 0, e: 'FAQ\'daki ilk maddeler kablo ve güç.' },
      { t: 'tf', q: 'Raspberry Pi\'de "under voltage" uyarısı görmezden gelinebilir.', a: false, e: 'FAQ: bu güç kaynağı sorunudur ve mutlaka düzeltilmelidir.' },
      { t: 'mc', q: 'Yazıcı kapalıyken sadece USB takılınca kartın ışıkları yanıyor. Bu neye işaret edebilir?', o: ['5V kaynaklarının karıştığına; gürültü yapabilir', 'Normal ve iyi bir durum', 'Kart Marlin\'de', 'CAN sonlandırma eksik'], a: 0, e: 'FAQ: kart iki kaynaktan da beslenebiliyorsa 5V karışıyordur; tek kaynaktan beslenmesi önerilir.' },
      { t: 'mc', q: 'Yeni kurulumda "Unable to connect" hatası. En olası neden?', o: ['[mcu] serial yolu yanlış veya kartta Klipper firmware\'i yok', 'Tabla soğuk', 'Mesh yok', 'Filaman bitti'], a: 0, e: 'Host karta hiç ulaşamıyorsa yol ya da firmware sorunludur.' },
      { t: 'mc', q: 'Kablo sadece kafa belli bir noktaya gelince kopuyor gibi. Ne kontrol edilir?', o: ['Hareketle bükülen kablolarda kırık/ezik', 'Termistör tipi', 'max_accel', 'Dilimleyici'], a: 0, e: 'Hareket kabloyu zorlar; kırık bir tel kısa süreli kopma veya gürültü yapar.' }
    ]
  }
  ]
},
{
  id: 'u14', title: 'Gelişmiş Kalibrasyon', desc: 'BLTouch, skew, burulma, özel homing', color: '#f43f5e', icon: '🧪',
  lessons: [
  {
    id: 'u14l1', title: 'BLTouch', doc: 'BLTouch.html',
    teach: [
      { title: '[bltouch]', body: '[probe] yerine **[bltouch]** bölümü kullanılır; o da **probe:z_virtual_endstop** oluşturur.\n• **sensor_pin**: çoğunda **^** (pull-up) gerekir\n• **control_pin**: pimi indirip kaldıran sinyal', code: '[bltouch]\nsensor_pin: ^PC14\ncontrol_pin: PA1\nx_offset: -44\ny_offset: -6\nz_offset: 2.1' },
      { title: 'Test komutları', body: '**BLTOUCH_DEBUG COMMAND=…**\n• **pin_down** / **pin_up**: pimi indir/kaldır\n• **self_test**: kendi testini yap\n• **reset**: hata (kırmızı yanıp sönme) durumunu sıfırla\n• **touch_mode**\n\nV3.1 için **BLTOUCH_STORE MODE=5V** veya **OD**.' }
    ],
    questions: [
      { t: 'fill', q: 'BLTouch pimini indir', code: 'BLTOUCH_DEBUG COMMAND=___', o: ['pin_down', 'down', 'deploy', 'probe'], a: 'pin_down', e: 'Komutlar: pin_down, touch_mode, pin_up, self_test, reset.' },
      { t: 'mc', q: 'BLTouch kırmızı yanıp sönüyor (hata durumunda). Hangi komut sıfırlar?', o: ['BLTOUCH_DEBUG COMMAND=reset', 'FIRMWARE_RESTART', 'BLTOUCH_STORE MODE=reset', 'PROBE'], a: 0, e: 'reset komutu BLTouch\'ın hata durumunu temizler.' },
      { t: 'tf', q: 'BLTouch için config\'e hem [probe] hem [bltouch] bölümü eklenmelidir.', a: false, e: '[bltouch], [probe]\'un yerine kullanılır.' },
      { t: 'mc', q: 'BLTouch\'ın sensor_pin\'inde genelde hangi önek gerekir?', o: ['^ (pull-up)', '! (ters)', '~ (pull-down)', 'Hiçbiri'], a: 0, e: 'Dokümana göre çoğu BLTouch sensor pininde pull-up ister.' },
      { t: 'mc', q: 'BLTouch V3.1\'in çıkış modunu EEPROM\'a kaydetmek için?', o: ['BLTOUCH_STORE MODE=5V', 'SAVE_CONFIG', 'BLTOUCH_DEBUG COMMAND=store', 'SAVE_VARIABLE'], a: 0, e: 'BLTOUCH_STORE MODE=5V veya MODE=OD.' }
    ]
  },
  {
    id: 'u14l2', title: 'Eğiklik ve burulma', doc: 'Skew_Correction.html',
    teach: [
      { title: 'Skew correction', body: 'Eksenler tam 90° değilse kareler paralelkenar çıkar. Kalibrasyon parçası basıp AC, BD, AD uzunluklarını ölçersin:', code: '[skew_correction]\n\nSET_SKEW XY=140.4,141.6,99.8\nSKEW_PROFILE SAVE=my_skew\nSAVE_CONFIG\n\n# başlangıç kodunda\nSKEW_PROFILE LOAD=my_skew' },
      { title: 'Axis twist compensation', body: 'X gantry hafif burulmuşsa probe, tablanın soluyla sağında farklı ölçer. **[axis_twist_compensation]** bunu düzeltir:\n**AXIS_TWIST_COMPENSATION_CALIBRATE** (AXIS verilmezse X).' }
    ],
    questions: [
      { t: 'mc', q: 'Bastığın kare paralelkenar gibi çıkıyor. Hangi özellik?', o: ['[skew_correction]', '[input_shaper]', '[bed_mesh]', '[axis_twist_compensation]'], a: 0, e: 'Eksenler arası açı hatasını skew correction düzeltir.' },
      { t: 'fill', q: 'XY ölçümlerini gir', code: 'SET_SKEW ___=140.4,141.6,99.8', o: ['XY', 'AC', 'PLANE', 'SKEW'], a: 'XY', e: 'SET_SKEW XY=ac,bd,ad (XZ ve YZ düzlemleri de olabilir).' },
      { t: 'tf', q: 'SKEW_PROFILE SAVE sonrası kalıcı olması için SAVE_CONFIG gerekir.', a: true, e: 'Bed mesh profillerinde olduğu gibi.' },
      { t: 'mc', q: 'Probe tablanın sol ve sağ kenarında sistematik farklı yükseklik ölçüyor; tabla aslında düz. Hangi özellik?', o: ['[axis_twist_compensation]', '[skew_correction]', '[z_tilt]', '[safe_z_home]'], a: 0, e: 'Gantry burulması probe\'u eğer; axis twist compensation bunu düzeltir.' },
      { t: 'mc', q: 'AXIS_TWIST_COMPENSATION_CALIBRATE\'te AXIS verilmezse hangi eksen?', o: ['X', 'Y', 'Z', 'İkisi birden'], a: 0, e: 'Varsayılan X.' },
      { t: 'mc', q: 'Düzeltme uygulandıktan sonra kalan eğikliği ölçmek için?', o: ['CALC_MEASURED_SKEW', 'GET_POSITION', 'SET_SKEW CLEAR=1', 'BED_MESH_OUTPUT'], a: 0, e: 'CALC_MEASURED_SKEW ölçümden eğikliği hesaplar; GET_CURRENT_SKEW mevcut ayarı gösterir.' }
    ]
  },
  {
    id: 'u14l3', title: 'Özel homing ve teşhis', doc: 'Config_Reference.html#homing_override',
    teach: [
      { title: '[homing_override]', body: 'G28 yerine kendi homing sıranı çalıştırır. Kurallar:\n• İçinde G28 geçerse normal homing çağrılır.\n• Script **bütün eksenleri** home etmeli.\n• **axes** varsayılanı xyz.\n• **set_position_z** ile home öncesi Z\'nin bir değerde olduğu varsayılır, böylece kafa önce kaldırılabilir.', code: '[homing_override]\nset_position_z: 0\ngcode:\n  G90\n  G1 Z5 F600\n  G28 X Y\n  G1 X117 Y117 F6000\n  G28 Z' },
      { title: 'Teşhis komutları', body: '• **[force_move] enable_force_move: True** olunca:\n  - **FORCE_MOVE STEPPER=… DISTANCE=… VELOCITY=…**: sınır kontrolü olmadan tek motoru oynatır\n  - **SET_KINEMATIC_POSITION**: Klipper\'a kafanın yerini "zorla" söyler\n• **STEPPER_BUZZ STEPPER=…**: motoru ileri geri titretir, hangi motorun hangi sokete bağlı olduğunu bulursun.\n⚠️ Bunlar teşhis içindir, çarpma riski var.' }
    ],
    questions: [
      { t: 'tf', q: '[homing_override] script\'i sadece istediği eksenleri home edebilir, diğerlerini atlayabilir.', a: false, e: 'Doküman: script tüm eksenleri home etmelidir.' },
      { t: 'mc', q: 'Home öncesi Z\'yi 5 mm kaldırmak için Klipper\'ın Z\'yi bilinen bir yerde sanması gerekir. Hangi ayar?', o: ['set_position_z', 'position_endstop', 'z_hop', 'homing_retract_dist'], a: 0, e: 'set_position_z verilince homing kontrolü kalkar, Z hareket ettirilebilir.' },
      { t: 'mc', q: 'Kablolar karıştı; hangi motor hangi sokete bağlı bulmak istiyorsun. Hangi komut?', o: ['STEPPER_BUZZ STEPPER=stepper_x', 'QUERY_ENDSTOPS', 'DUMP_TMC', 'G28'], a: 0, e: 'STEPPER_BUZZ motoru 1 mm ileri geri titreştirir, hangisi oynuyor görürsün.' },
      { t: 'mc', q: 'FORCE_MOVE "Unknown command" veriyor. Neden?', o: ['[force_move] enable_force_move: True yok', 'Home yapılmamış', 'Motor kapalı', 'TMC hatası'], a: 0, e: 'FORCE_MOVE ve SET_KINEMATIC_POSITION bu ayarla açılır.' },
      { t: 'tf', q: 'FORCE_MOVE eksen sınırlarını (position_max) kontrol etmez.', a: true, e: 'Doküman uyarıyor: sınır kontrolü yok, yanlış komut zarar verebilir. Sonra G28 yap.' },
      { t: 'mc', q: 'IDEX yazıcıda diğer kafaya geçmek için?', o: ['SET_DUAL_CARRIAGE CARRIAGE=…', 'ACTIVATE_EXTRUDER yeterli', 'T1 hazır gelir', 'SWITCH_HEAD'], a: 0, e: '[dual_carriage] tanımlıysa SET_DUAL_CARRIAGE kullanılır; T0/T1 genelde makro olarak yazılır.' }
    ]
  }
  ]
},
{
  id: 'u15', title: 'Arıza Vakaları', desc: 'Gerçek hata ekranları, teşhis koy', color: '#dc2626', icon: '🚨',
  lessons: [
  {
    id: 'u15l1', title: 'MCU kapandı!', doc: 'FAQ.html',
    teach: [
      { title: 'Teknisyen gibi düşün', body: 'Bu ünitede sana bir konsol çıktısı göstereceğim, sen teşhis koyacaksın.\n\nKlipper MCU kapanmalarında mesajın başına bakar:\n• **Timer too close** → host aşırı yüklü (CPU, swap, ısınma, voltaj)\n• **ADC out of range** → bir sıcaklık min_temp/max_temp dışına çıktı\n• **Stepper too far in past** / **Rescheduled timer in the past** → MCU\'dan kaldıramayacağı adım hızı istendi\n• **Command request** → M112 ya da host içi hata\n\nSorun çözülünce: **FIRMWARE_RESTART**' }
    ],
    questions: [
      { t: 'mc', q: 'Konsolda bu var. En olası neden?', log: "!! MCU 'mcu' shutdown: Timer too close\n// This often indicates the host computer is overloaded.\n// Once the underlying issue is corrected, use the\n// \"FIRMWARE_RESTART\" command to reset the firmware", o: ['Host bilgisayar aşırı yüklü (CPU, swap, ısı, voltaj)', 'Termistör kopuk', 'Endstop arızalı', 'Filaman bitti'], a: 0, e: 'Timer too close genelde host\'un zamanında veri gönderememesidir: kamera yayını, ağır eklenti, SD kart hatası, ısınan Pi.' },
      { t: 'mc', q: 'Gece garajda yazıcı açıldı ve şu hata geldi. Termistör sağlam. Ne olmuş olabilir?', log: "!! MCU 'mcu' shutdown: ADC out of range\n// This generally occurs when a heater temperature exceeds\n// its configured min_temp or max_temp.", o: ['Ortam min_temp\'in altında (örn. min_temp: 5, garaj 2 °C)', 'Host aşırı yüklü', 'USB kablosu', 'Bed mesh bozuk'], a: 0, e: 'ADC out of range: sıcaklık min/max aralığı dışına çıktı. Soğuk ortamda min_temp çok yüksekse de olur.' },
      { t: 'mc', q: 'Isıtırken birden şu hata. İlk ne kontrol edilir?', log: "!! MCU 'mcu' shutdown: ADC out of range\nextruder: target=210 temp=-14.2", o: ['Termistör kablosu/soketi (kopuk ya da çıkmış)', 'PID değerleri', 'max_velocity', 'Dilimleyici'], a: 0, e: 'Eksi bir sıcaklık okuması tipik olarak açık devre (kopuk termistör) demektir.' },
      { t: 'mc', q: 'microsteps: 256 yapıp hızlı hareket verince bu geldi. Neden?', log: "!! MCU 'mcu' shutdown: Stepper too far in past\n// This generally occurs when the micro-controller has been\n// requested to step at a rate higher than it is capable of\n// obtaining.", o: ['İstenen adım hızı MCU\'nun kapasitesini aştı', 'Termistör arızası', 'CAN sonlandırma', 'Firmware eski'], a: 0, e: 'Çok yüksek mikroadım × yüksek hız = saniyede çok fazla adım. Mikroadımı düşür ya da hızı sınırla.' },
      { t: 'mc', q: 'Bu mesaj ne anlama gelir?', log: "!! MCU 'mcu' shutdown: Command request\n// This generally occurs in response to an M112 G-Code command\n// or in response to an internal error in the host software.", o: ['Biri M112 verdi ya da host yazılımında iç hata oldu', 'Kart yandı', 'Termistör kısa devre', 'Tabla soğuk'], a: 0, e: 'Command request, kapanmayı host\'un istediğini gösterir: M112 veya iç hata. klippy.log\'a bak.' },
      { t: 'type', q: 'Sorunu giderdikten sonra yazıcıyı kapanmış durumdan çıkaran komut?', a: ['FIRMWARE_RESTART'], e: 'Klipper\'ın kendi mesajı da FIRMWARE_RESTART der.' },
      { t: 'match', q: 'Hata mesajını nedeniyle eşleştir', pairs: [['Timer too close', 'Host aşırı yüklü'], ['ADC out of range', 'Sıcaklık sınır dışı'], ['Stepper too far in past', 'Adım hızı çok yüksek'], ['Command request', 'M112 / iç hata']], e: 'Bu dördü MCU kapanmalarının büyük kısmını oluşturur.' }
    ]
  },
  {
    id: 'u15l2', title: 'Homing ve probe hataları', doc: 'Config_checks.html',
    teach: [
      { title: 'Homing hata mesajları', body: '• **No trigger on x after full movement** → kafa sonuna kadar gitti ama endstop tetiklenmedi (kablo, yanlış pin, sensörsüz homing hassasiyeti düşük).\n• **Endstop x still triggered after retract** → geri çekildikten sonra hâlâ basılı görünüyor (mantık ters: ! eksik/fazla, ya da switch takılı).\n• **Probe triggered prior to movement** → probe daha inmeye başlamadan tetikli görünüyor.\n\nEn iyi teşhis aracı: **QUERY_ENDSTOPS** (basmadan ve basarak iki kez sor).' }
    ],
    questions: [
      { t: 'mc', q: 'G28 sonrası bu hata. Kafa X sonuna kadar gidip duvara dayandı. Neden?', log: "!! No trigger on x after full movement", o: ['X endstop tetiklenmedi: kablo, pin ya da sensörsüz hassasiyet', 'Termistör kopuk', 'Host aşırı yüklü', 'Mesh yok'], a: 0, e: 'Klipper tam mesafe gitti ama tetik sinyali gelmedi.' },
      { t: 'mc', q: 'Endstop\'a dokunmadan QUERY_ENDSTOPS böyle diyor. Düzeltme?', log: "> QUERY_ENDSTOPS\n// x:TRIGGERED y:open z:open", o: ['stepper_x endstop_pin\'deki ! önekini ekle/kaldır', 'Motor yönünü çevir', 'homing_speed\'i artır', 'Kabloyu Y\'ye tak'], a: 0, e: 'Basılmamışken TRIGGERED görünüyorsa mantık terstir; ! ile çevrilir.' },
      { t: 'mc', q: 'Bu hatanın en olası nedeni?', log: "!! Endstop x still triggered after retract", o: ['Endstop mantığı ters ya da switch basılı kalmış', 'Hız çok düşük', 'Filaman yok', 'PID bozuk'], a: 0, e: 'Geri çekildiği halde basılı görünüyorsa sinyal terstir veya switch mekanik olarak takılıdır.' },
      { t: 'mc', q: 'BLTouch\'la Z home ederken bu geldi. Ne kontrol edilir?', log: "!! Probe triggered prior to movement", o: ['Probe zaten tetikli: pin ters (!), BLTouch hata modunda ya da pin_move_time kısa', 'X endstop', 'Mesh profili', 'Filaman sensörü'], a: 0, e: 'Probe inmeye başlamadan "tetikli" okunuyor. QUERY_PROBE ve BLTOUCH_DEBUG ile test et.' },
      { t: 'mc', q: 'Sensörsüz homing\'de X yarı yolda "home oldu" sanıp duruyor. Ne yaparsın?', o: ['driver_SGTHRS değerini düşür (daha az hassas)', 'driver_SGTHRS\'i 255 yap', 'Mikroadımı artır', 'homing_retract_dist\'i 10 yap'], a: 0, e: 'TMC2209\'da 255 en hassas; erken tetikleniyorsa değeri düşürürsün.' },
      { t: 'order', q: 'Yeni takılan endstop\'u test etme sırası', items: ['Endstop\'a dokunmadan QUERY_ENDSTOPS', 'Sonucun "open" olduğunu gör', 'Elinle basılı tutup tekrar QUERY_ENDSTOPS', 'Sonucun "TRIGGERED" olduğunu gör'], e: 'İki durumu da doğrulamadan G28 yapma.' }
    ]
  },
  {
    id: 'u15l3', title: 'Baskı sırasında sorunlar', doc: 'FAQ.html',
    teach: [
      { title: 'Baskı ortasında hatalar', body: '• **Heater extruder not heating at expected rate** → sensör yerinden çıkmış, kartuş zayıf, fan hotend\'e üflüyor (silikon çorap yok).\n• **Move exceeds maximum extrusion** → bir hareket max_extrude_cross_section\'ı aştı (yanlış dilimleme, çok kalın çizgi).\n• **Extrude only move too long** → tek ekstrüzyon max_extrude_only_distance\'ı (50 mm) aştı.\n• **Lost communication with MCU** → kablo/güç.\n\nHer zaman: **klippy.log**' }
    ],
    questions: [
      { t: 'mc', q: 'İlk katmanlarda parça fanı %100 açılınca bu hata geliyor. Muhtemel neden?', log: "!! Heater extruder not heating at expected rate\n// Once the underlying issue is corrected, use the\n// \"FIRMWARE_RESTART\" command", o: ['Fan ısıtıcı bloğu soğutuyor; silikon çorap yok/yırtık', 'Endstop arızası', 'CAN direnci', 'Host aşırı yüklü'], a: 0, e: 'Isıtıcı ısı kaybını yetiştiremiyor. Çorap tak, fan yönünü kontrol et; PID\'i fan açıkken tekrar yapmak da yardımcı olur.' },
      { t: 'mc', q: 'Bu hata ne zaman çıkar?', log: "!! Move exceeds maximum extrusion (0.912mm^2 vs 0.640mm^2)", o: ['Bir hareket izin verilen ekstrüzyon kesitini aşınca', 'Nozul soğukken', 'Home yapılmadan', 'CAN koptuğunda'], a: 0, e: 'Varsayılan sınır 4 × nozzle_diameter². Genelde dilimleyicide yanlış nozul çapı/hacimsel ayar demektir.' },
      { t: 'mc', q: 'Filaman yükleme makrosunda bu hata. Çözüm?', log: "!! Extrude only move too long (100.000mm vs 50.000mm)", o: ['Hareketi 50 mm\'lik parçalara böl ya da max_extrude_only_distance\'ı artır', 'Nozulu soğut', 'G28 yap', 'Firmware\'i yükle'], a: 0, e: 'Tek ekstrüzyon hareketi varsayılan 50 mm\'yi aşamaz.' },
      { t: 'mc', q: 'Uzun baskıda katman kayması oldu, hata mesajı yok. İlk bakılacaklar?', o: ['Kayış gerginliği, kasnak vidası, motor akımı ve hız/ivme', 'PID', 'Filaman sensörü', 'Moonraker'], a: 0, e: 'Kayma genelde mekanik ya da motorun tork yetersizliğidir (akım düşük, ivme yüksek).' },
      { t: 'tf', q: 'Bir hata aldığında ayrıntılı bilgi ve olaylar klippy.log dosyasında bulunur.', a: true, e: 'Hata bildirirken (ör. Klipper Discourse) klippy.log istenir.' },
      { t: 'mc', q: 'Müşteri "baskı ortasında kart bağlantısı kopuyor" diyor; Pi\'de şimşek simgesi görünüyor. Öneri?', o: ['Kaliteli 5V güç kaynağı ve kablo kullanmak', 'PID kalibrasyonu', 'Input shaper', 'Mesh\'i yeniden almak'], a: 0, e: 'Şimşek = under voltage. FAQ\'a göre önce güç kaynağı düzeltilmeli.' }
    ]
  }
  ]
}
);
