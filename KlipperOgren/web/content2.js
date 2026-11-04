// Klipper Öğren — ders içeriği (Ünite 6-9)
window.KLIPPER_UNITS = window.KLIPPER_UNITS || [];
window.KLIPPER_UNITS.push(
{
  id: 'u6', title: 'Probe ve Seviyeleme', desc: 'Probe, bed mesh, tilt ayarları', color: '#14b8a6', icon: '📐',
  lessons: [
  {
    id: 'u6l1', title: 'Probe kurulumu', doc: 'Probe_Calibrate.html',
    teach: [
      { title: '[probe] ve sanal endstop', body: 'Probe\'u Z endstop yerine kullanmak için stepper_z\'de **endstop_pin: probe:z_virtual_endstop** yazılır. Bu durumda stepper_z\'de **position_endstop yazılmaz**.\n\nKafayı tablanın ortasında home etmek için **[safe_z_home]** eklenir.', code: '[probe]\npin: ^PC14\nx_offset: -40\ny_offset: -10\nz_offset: 1.2\n\n[stepper_z]\nendstop_pin: probe:z_virtual_endstop\n\n[safe_z_home]\nhome_xy_position: 117, 117\nz_hop: 10' },
      { title: 'z_offset kalibrasyonu', body: '**PROBE_CALIBRATE** kâğıt testi aracını başlatır:\n• **TESTZ Z=-0.1** → 0.1 mm aşağı\n• **TESTZ Z=+** / **TESTZ Z=-** → önceki denemelere göre yarıla\n• Kâğıt hafif sürtünce **ACCEPT**, sonra **SAVE_CONFIG**.\nVazgeçmek için **ABORT**.' }
    ],
    questions: [
      { t: 'fill', q: 'Probe\'u Z endstop olarak kullan', code: '[stepper_z]\nendstop_pin: ___', o: ['probe:z_virtual_endstop', 'probe:z_endstop', '^PC14', 'virtual_z'], a: 'probe:z_virtual_endstop', e: '[probe] bölümü probe:z_virtual_endstop adında sanal bir pin oluşturur.' },
      { t: 'tf', q: 'probe:z_virtual_endstop kullanırken stepper_z\'de position_endstop da tanımlanmalıdır.', a: false, e: 'Hayır, dokümana göre bu durumda position_endstop tanımlanmaz; z_offset kullanılır.' },
      { t: 'order', q: 'Probe z_offset kalibrasyonu sırası', items: ['G28', 'PROBE_CALIBRATE', 'TESTZ ile kâğıt testine kadar in', 'ACCEPT', 'SAVE_CONFIG'], e: 'Home → kalibrasyon aracı → ince ayar → kabul → kaydet.' },
      { t: 'mc', q: 'Kâğıt testinde nozul fazla aşağıda. 0.05 mm yukarı çıkmak için?', o: ['TESTZ Z=0.05', 'TESTZ Z=-0.05', 'G1 Z0.05', 'SET_GCODE_OFFSET Z=0.05'], a: 0, e: 'Pozitif TESTZ yukarı, negatif aşağı götürür.' },
      { t: 'mc', q: 'PROBE_ACCURACY varsayılan olarak kaç ölçüm alır?', o: ['10', '3', '5', '25'], a: 0, e: 'Varsayılan 10 örnek; maks, min, ortalama, medyan ve standart sapmayı verir.' },
      { t: 'mc', q: '[safe_z_home] ne işe yarar?', o: ['Z\'yi belirli bir X,Y noktasında (genelde tabla ortası) home eder', 'Z\'yi hiç home etmez', 'Z\'yi max\'a home eder', 'Probe\'u kapatır'], a: 0, e: 'Probe tablanın dışında kalmasın diye Z home noktasını home_xy_position ile belirlersin.' },
      { t: 'mc', q: 'Kâğıt testi sırasında vazgeçmek için?', o: ['ABORT', 'CANCEL', 'M112', 'RESTART'], a: 0, e: 'ABORT manuel prob aracını sonlandırır, ACCEPT ise kabul eder.' },
      { t: 'tf', q: 'x_offset ve y_offset, probe ile nozul arasındaki mesafedir.', a: true, e: 'Evet, mm cinsinden; varsayılanları 0.' }
    ]
  },
  {
    id: 'u6l2', title: 'Bed mesh', doc: 'Bed_Mesh.html',
    teach: [
      { title: 'Ağ haritası', body: 'Tablanın birçok noktasını ölçer ve Z\'yi baskı boyunca otomatik düzeltir.', code: '[bed_mesh]\nspeed: 120\nhorizontal_move_z: 5\nmesh_min: 10, 10\nmesh_max: 220, 220\nprobe_count: 5, 5' },
      { title: 'Komutlar', body: '• **BED_MESH_CALIBRATE**: Ölçer, bitince **hemen aktif** olur. PROFILE yazmazsan "default" profiline kaydeder.\n• **ADAPTIVE=1**: Sadece baskı alanını ölçer.\n• **BED_MESH_PROFILE SAVE=/LOAD=/REMOVE=**: Profil yönetimi (kalıcı olması için SAVE_CONFIG).\n• **BED_MESH_CLEAR**: Mesh\'i kapatır, bitiş G-code\'una koyman önerilir.' }
    ],
    questions: [
      { t: 'mc', q: 'BED_MESH_CALIBRATE bittikten sonra mesh ne zaman aktif olur?', o: ['Hemen', 'SAVE_CONFIG sonrası', 'Bir sonraki baskıda', 'BED_MESH_PROFILE LOAD ile'], a: 0, e: 'Dokümana göre mesh başarıyla bittiği anda aktiftir.' },
      { t: 'mc', q: 'PROFILE parametresi verilmezse mesh hangi profile kaydedilir?', o: ['default', 'mesh1', 'auto', 'Kaydedilmez'], a: 0, e: '"default" profiline.' },
      { t: 'fill', q: 'Sadece baskı alanını ölçen mesh', code: 'BED_MESH_CALIBRATE ___=1', o: ['ADAPTIVE', 'SMART', 'AREA', 'FAST'], a: 'ADAPTIVE', e: 'ADAPTIVE=1, baskıdaki nesnelere göre ölçüm alanını küçültür (Klipper 0.13 ile geldi).' },
      { t: 'tf', q: 'BED_MESH_PROFILE SAVE=pei sonrası SAVE_CONFIG verilmezse profil restart\'ta kaybolur.', a: true, e: 'SAVE ve REMOVE işlemlerinden sonra kalıcı olması için SAVE_CONFIG gerekir.' },
      { t: 'mc', q: 'Dokümana göre bitiş G-code\'una eklenmesi önerilen mesh komutu?', o: ['BED_MESH_CLEAR', 'BED_MESH_CALIBRATE', 'BED_MESH_OUTPUT', 'BED_MESH_MAP'], a: 0, e: 'BED_MESH_CLEAR mesh\'i temizler, Z düzeltmesini kaldırır.' },
      { t: 'mc', q: 'probe_count: 5, 5 kaç nokta ölçer?', o: ['25', '10', '5', '50'], a: 0, e: '5 × 5 = 25 nokta.' },
      { t: 'tf', q: 'ADAPTIVE=1 ile oluşturulan profilin adı adaptive- ile başlar ve tekrar kullanmak için saklanmamalıdır.', a: true, e: 'Doküman böyle diyor; her baskıda yeniden oluşturulur.' },
      { t: 'type', q: '"pei" adlı mesh profilini yükleyen komutu yaz', a: ['BED_MESH_PROFILE LOAD=pei'], e: 'BED_MESH_PROFILE LOAD=pei' }
    ]
  },
  {
    id: 'u6l3', title: 'Tilt, gantry ve vidalar', doc: 'G-Codes.html#z_tilt',
    teach: [
      { title: 'Çoklu Z motoru', body: '• **Z_TILT_ADJUST**: Birden çok bağımsız Z motorunu probe ile hizalar (örn. 2-3 Z motorlu yazıcılar).\n• **QUAD_GANTRY_LEVEL**: 4 Z motorlu gantry\'yi (Voron 2.4 gibi) düzler.\n\nİkisi de G28 sonrası, mesh\'ten önce yapılır.' },
      { title: 'Vida ayarı', body: '• **SCREWS_TILT_CALCULATE**: Probe ile vida noktalarını ölçer, her vidanın kaç tur çevrileceğini söyler. **Önce G28 şart!**\n• **BED_SCREWS_ADJUST**: Probe olmadan kâğıtla vida ayarı.\n• **Z_ENDSTOP_CALIBRATE**: Mekanik Z endstop\'un position_endstop değerini kalibre eder.' }
    ],
    questions: [
      { t: 'mc', q: 'Voron 2.4 gibi 4 Z motorlu, hareketli gantry\'li yazıcıda hangi komut?', o: ['QUAD_GANTRY_LEVEL', 'Z_TILT_ADJUST', 'BED_TILT_CALIBRATE', 'SCREWS_TILT_CALCULATE'], a: 0, e: 'QUAD_GANTRY_LEVEL dört köşeyi ölçüp her Z motorunu ayrı ayarlar.' },
      { t: 'mc', q: 'Tabla vidalarını kaç tur çevireceğini söyleyen komut?', o: ['SCREWS_TILT_CALCULATE', 'BED_MESH_CALIBRATE', 'Z_TILT_ADJUST', 'PROBE_ACCURACY'], a: 0, e: 'SCREWS_TILT_CALCULATE, örn. "CW 00:15" gibi saat yönü ve dakika cinsinden tur söyler.' },
      { t: 'tf', q: 'SCREWS_TILT_CALCULATE\'den önce G28 yapmak zorunludur.', a: true, e: 'Doküman: "You MUST always do a G28 before using this command."' },
      { t: 'order', q: 'Çift Z motorlu bir yazıcıda baskı öncesi doğru sıra', items: ['G28', 'Z_TILT_ADJUST', 'G28 Z', 'BED_MESH_CALIBRATE'], e: 'Tilt ayarı Z\'yi değiştirdiği için sonra Z tekrar home edilir, en son mesh alınır.' },
      { t: 'mc', q: 'Mekanik Z endstop\'un position_endstop değerini kâğıt testiyle bulan komut?', o: ['Z_ENDSTOP_CALIBRATE', 'PROBE_CALIBRATE', 'QUERY_ENDSTOPS', 'G92 Z0'], a: 0, e: 'Z_ENDSTOP_CALIBRATE, PROBE_CALIBRATE ile aynı TESTZ/ACCEPT araçlarını kullanır.' },
      { t: 'match', q: 'Eşleştir', pairs: [['Z_TILT_ADJUST', 'Bağımsız Z motorlarını hizalar'], ['QUAD_GANTRY_LEVEL', '4 köşeli gantry'], ['BED_SCREWS_ADJUST', 'Probesuz vida ayarı'], ['SCREWS_TILT_CALCULATE', 'Probe ile vida turu hesabı']], e: 'Hangisini kullanacağın yazıcının mekaniğine bağlı.' }
    ]
  }
  ]
},
{
  id: 'u7', title: 'Makrolar', desc: 'gcode_macro, Jinja2, değişkenler', color: '#eab308', icon: '🧩',
  lessons: [
  {
    id: 'u7l1', title: 'İlk makro', doc: 'Command_Templates.html',
    teach: [
      { title: 'gcode_macro', body: 'Kendi komutunu tanımlarsın. **gcode:** satırı en baştan başlar, altındaki satırlar **mutlaka girintili** olur.', code: '[gcode_macro PARK]\ndescription: Kafayı arkaya park et\ngcode:\n  G90\n  G1 X10 Y220 F6000' },
      { title: 'İsim kuralları', body: '• Büyük/küçük harf fark etmez: PARK = park.\n• İsimde sayı varsa hepsi **sonda** olmalı: TEST_MACRO25 ✓, MACRO25_TEST3 ✗\n• **description:** HELP komutunda görünür. Yazmazsan "G-Code macro" olur.\n\nÇağırmak için terminale sadece adını yazarsın: **PARK**' }
    ],
    questions: [
      { t: 'fill', q: 'Makro bölümünü başlat', code: '[___ PARK]\ngcode:\n  G1 X10 Y220 F6000', o: ['gcode_macro', 'macro', 'gcode', 'script'], a: 'gcode_macro', e: 'Makrolar [gcode_macro İSİM] bölümüyle tanımlanır.' },
      { t: 'tf', q: 'Makronun gcode: altındaki satırları satır başından (girintisiz) yazılabilir.', a: false, e: 'Hayır. Girintisiz satır yeni bir ayar sanılır. Makro satırları her zaman girintili olmalı.' },
      { t: 'mc', q: 'Hangi makro adı GEÇERSİZ?', o: ['MACRO25_TEST3', 'TEST_MACRO25', 'PARK', 'LOAD_FILAMENT'], a: 0, e: 'Sayılar varsa hepsi adın sonunda olmalı.' },
      { t: 'mc', q: 'Makroya açıklama eklemek için hangi ayar?', o: ['description:', 'help:', 'info:', 'comment:'], a: 0, e: 'description: HELP çıktısında ve otomatik tamamlamada görünür.' },
      { t: 'tf', q: '[gcode_macro park] olarak tanımlanan makro terminalde PARK yazınca da çalışır.', a: true, e: 'Makro adları büyük/küçük harf duyarsızdır.' },
      { t: 'order', q: 'Doğru makro yapısını kur', items: ['[gcode_macro WIPE]', 'description: Nozulu sil', 'gcode:', '  G1 X5 Y5 F6000', '  G1 X50 F6000'], e: 'Bölüm adı → ayarlar → gcode: → girintili komutlar.' }
    ]
  },
  {
    id: 'u7l2', title: 'Jinja2 ve parametreler', doc: 'Command_Templates.html#template-expansion',
    teach: [
      { title: '{ } ve {% %}', body: 'Makrolar **Jinja2** şablon diliyle işlenir:\n• **{ ifade }** → değeri yerine yazar\n• **{% komut %}** → if, for, set gibi kontroller', code: '{% set wipe_count = 3 %}\n{% for i in range(wipe_count) %}\n  G1 X5 F6000\n  G1 X50 F6000\n{% endfor %}' },
      { title: 'params', body: 'Makroya verilen parametreler **params** ile okunur:\n• Adlar her zaman **BÜYÜK HARF**\n• Değerler her zaman **metin (string)** gelir; matematik için **|float** veya **|int**\n• **|default(…)** ile varsayılan verirsin', code: '[gcode_macro HEAT_BED]\ngcode:\n  {% set t = params.TEMP|default(60)|float %}\n  M190 S{t}' }
    ],
    questions: [
      { t: 'mc', q: 'Makroda bir değeri yerine yazdırmak için hangi parantez kullanılır?', o: ['{ }', '{% %}', '[ ]', '$( )'], a: 0, e: '{ } ifadeyi değerlendirip sonucunu yazar; {% %} kontrol komutları içindir.' },
      { t: 'mc', q: 'HEAT_BED temp=70 diye çağırdın. Makroda değere nasıl ulaşırsın?', o: ['params.TEMP', 'params.temp', 'param[0]', 'args.TEMP'], a: 0, e: 'Parametre adları makro içinde her zaman büyük harftir.' },
      { t: 'tf', q: 'params ile gelen değerler otomatik olarak sayıya çevrilir.', a: false, e: 'Hayır, her zaman string gelir. Hesap yapacaksan |float veya |int kullan.' },
      { t: 'fill', q: 'Parametre yoksa 200 kullan ve sayıya çevir', code: '{% set t = params.TEMP|___(200)|float %}', o: ['default', 'or', 'else', 'fallback'], a: 'default', e: '|default(200) parametre verilmezse 200 kullanır.' },
      { t: 'mc', q: '"SET_PERCENT VALUE=.2" çağrıldı. Makroda "M117 { params.VALUE|float * 100 }%" ne üretir?', o: ['M117 20.0%', 'M117 .2%', 'M117 VALUE%', 'Hata verir'], a: 0, e: '0.2 × 100 = 20.0. Bu örnek doğrudan dokümandan.' },
      { t: 'order', q: 'Basit bir if bloğu kur', items: ['{% if params.TEMP|int > 250 %}', '  RESPOND MSG="Çok sıcak!"', '{% else %}', '  M104 S{params.TEMP}', '{% endif %}'], e: 'Jinja2\'de if bloğu {% endif %} ile kapanır.' },
      { t: 'mc', q: 'Makro içinde yazıcının mevcut durumunu (fan hızı, sıcaklık…) okumak için hangi değişken?', o: ['printer', 'status', 'klipper', 'machine'], a: 0, e: 'printer değişkeni, örn. printer.fan.speed veya printer.extruder.temperature.' }
    ]
  },
  {
    id: 'u7l3', title: 'Değişkenler ve ileri makro', doc: 'Command_Templates.html#variables',
    teach: [
      { title: 'variable_ ve SET_GCODE_VARIABLE', body: '**variable_** önekiyle makroya kalıcı-olmayan değişken tanımlarsın. Değişken adında büyük harf kullanılamaz.', code: '[gcode_macro START]\nvariable_bed_temp: 60\ngcode:\n  M190 S{bed_temp}\n\n# Çalışırken değiştir:\nSET_GCODE_VARIABLE MACRO=START VARIABLE=bed_temp VALUE=70' },
      { title: 'rename_existing ve delayed_gcode', body: '• **rename_existing**: Hazır bir komutu (örn. M109) kendi makronla değiştirir; eskisini verdiğin yeni adla çağırırsın.\n• **[delayed_gcode]** + **UPDATE_DELAYED_GCODE ID=… DURATION=…**: Belirli süre sonra çalışır. DURATION=0 iptal eder.\n\n⚠️ Makro önce **tamamen** değerlendirilir, sonra komutlar çalışır. Makro içinde yaptığın değişikliği aynı makro içinde printer\'dan okuyamazsın.' }
    ],
    questions: [
      { t: 'fill', q: 'Makroya değişken ekle', code: '[gcode_macro START]\n___fan: 255\ngcode:\n  M106 S{fan}', o: ['variable_', 'var_', 'set_', 'param_'], a: 'variable_', e: 'variable_ önekiyle tanımlanır, makroda sadece adıyla (fan) kullanılır.' },
      { t: 'mc', q: 'Çalışma anında bir makro değişkenini değiştiren komut?', o: ['SET_GCODE_VARIABLE', 'SAVE_VARIABLE', 'SET_VARIABLE', 'UPDATE_MACRO'], a: 0, e: 'SET_GCODE_VARIABLE MACRO=… VARIABLE=… VALUE=…; değer Python literal olarak yorumlanır.' },
      { t: 'tf', q: 'variable_BedTemp geçerli bir değişken adıdır.', a: false, e: 'Değişken adlarında büyük harf kullanılamaz: variable_bed_temp olmalı.' },
      { t: 'mc', q: 'Yazıcı yeniden başlasa da değeri korunan değişken için hangisi?', o: ['[save_variables] + SAVE_VARIABLE', 'variable_', 'SET_GCODE_VARIABLE', 'params'], a: 0, e: 'SAVE_VARIABLE diske yazar; variable_ değerleri restart\'ta config\'teki değere döner.' },
      { t: 'mc', q: 'Bekleyen bir delayed_gcode\'u iptal etmek için?', o: ['UPDATE_DELAYED_GCODE ID=isim DURATION=0', 'CANCEL_DELAYED_GCODE', 'DELAYED_GCODE STOP=1', 'M112'], a: 0, e: 'DURATION=0 bekleyen zamanlayıcıyı iptal eder.' },
      { t: 'mc', q: 'Hazır bir G-code\'u kendi makronla değiştirip eskisine yeni adla ulaşmak için hangi ayar?', o: ['rename_existing', 'override:', 'replace_gcode', 'alias:'], a: 0, e: 'rename_existing: M109.1 gibi bir ad verirsin; makron eskisini o adla çağırır. Dikkatli kullan.' },
      { t: 'tf', q: 'Makro önce baştan sona değerlendirilir, oluşan komutlar sonra çalışır.', a: true, e: 'Bu yüzden makroda M104 verip hemen ardından printer.extruder.target\'ı okursan yeni değeri görmezsin.' },
      { t: 'mc', q: 'Makrodan terminale "// mesaj" şeklinde bilgi yazdırmak için?', o: ['{ action_respond_info("mesaj") }', 'PRINT("mesaj")', 'echo mesaj', '{ log("mesaj") }'], a: 0, e: 'action_respond_info her satırı "// " önekiyle yazar. Alternatif: [respond] ekleyip RESPOND MSG="…"' }
    ]
  }
  ]
},
{
  id: 'u8', title: 'İnce Ayar', desc: 'Pressure advance, input shaper, TMC', color: '#ec4899', icon: '🎯',
  lessons: [
  {
    id: 'u8l1', title: 'Pressure advance', doc: 'Pressure_Advance.html',
    teach: [
      { title: 'Ne işe yarar?', body: 'Kafa hızlanırken ekstrüdere biraz fazla filaman iter, yavaşlarken aynı miktarı geri çeker. Köşelerdeki şişme ve boşlukları azaltır.\n\nVarsayılan **0** (kapalı).', code: 'SET_PRESSURE_ADVANCE ADVANCE=0.045' },
      { title: 'Tuning tower ile bulmak', body: '1. Köşeleri belirginleştir:\n**SET_VELOCITY_LIMIT SQUARE_CORNER_VELOCITY=1 ACCEL=500**\n2. Direct drive:\n**TUNING_TOWER COMMAND=SET_PRESSURE_ADVANCE PARAMETER=ADVANCE START=0 FACTOR=.005**\nUzun bowden: **FACTOR=.020**\n3. Kuleyi bas, köşelerin en iyi göründüğü yüksekliği ölç.\n4. değer = START + yükseklik × FACTOR' }
    ],
    questions: [
      { t: 'mc', q: 'pressure_advance varsayılan değeri?', o: ['0 (kapalı)', '0.05', '0.5', '1'], a: 0, e: 'Varsayılan 0, yani kapalı.' },
      { t: 'mc', q: 'Direct drive ekstrüder için dokümanın önerdiği TUNING_TOWER FACTOR değeri?', o: ['.005', '.020', '.1', '1'], a: 0, e: 'Direct drive .005, uzun bowden .020.' },
      { t: 'mc', q: 'FACTOR=.005, START=0 ile basılan kulede en iyi köşe 9 mm yükseklikte. pressure_advance?', o: ['0.045', '0.09', '0.0045', '0.9'], a: 0, e: '0 + 9 × 0.005 = 0.045.' },
      { t: 'fill', q: 'Pressure advance\'i ayarla', code: 'SET_PRESSURE_ADVANCE ___=0.04', o: ['ADVANCE', 'VALUE', 'PA', 'K'], a: 'ADVANCE', e: 'SET_PRESSURE_ADVANCE ADVANCE=… (Marlin\'deki K faktörünün karşılığı).' },
      { t: 'tf', q: 'Testten önce SQUARE_CORNER_VELOCITY=1 yapılması, köşelerdeki basınç etkisini daha görünür yapar.', a: true, e: 'Köşelerden yavaş geçince basınç etkisi belirginleşir.' },
      { t: 'mc', q: 'Bulduğun değeri kalıcı yapmak için nereye yazarsın?', o: ['[extruder] bölümüne pressure_advance:', '[printer] bölümüne', 'SAVE_CONFIG yeter', 'Dilimleyiciye'], a: 0, e: 'TUNING_TOWER sonucu SAVE_CONFIG ile yazılmaz; [extruder] pressure_advance: 0.045 diye elle eklersin.' },
      { t: 'tf', q: 'pressure_advance_smooth_time 200 ms\'yi geçemez.', a: true, e: 'Evet, varsayılanı 0.040 sn (40 ms).' }
    ]
  },
  {
    id: 'u8l2', title: 'Input shaper', doc: 'Resonance_Compensation.html',
    teach: [
      { title: 'Titreşim gölgelerine son', body: 'Input shaper, yazıcının rezonans frekansını bastırarak "ghosting/ringing" denen dalgalanma izlerini azaltır.', code: '[input_shaper]\nshaper_freq_x: 48.6\nshaper_type_x: mzv\nshaper_freq_y: 39.2\nshaper_type_y: ei' },
      { title: 'İvmeölçerle otomatik', body: 'ADXL345 gibi bir ivmeölçer bağlarsın:\n• **ACCELEROMETER_QUERY**: Bağlantı testi\n• **TEST_RESONANCES AXIS=X**: Ölçüm\n• **SHAPER_CALIBRATE**: Ölçer ve en iyi shaper\'ı önerir\n• Sonra **SAVE_CONFIG**\n\nShaper tipleri: zv, mzv, zvd, ei, 2hump_ei, 3hump_ei. Varsayılan **mzv**.' }
    ],
    questions: [
      { t: 'mc', q: 'Input shaper hangi baskı kusurunu azaltır?', o: ['Ghosting / ringing (dalgalanma izleri)', 'Stringing (ipliklenme)', 'Warping (kalkma)', 'Under extrusion'], a: 0, e: 'Rezonans kaynaklı dalga izlerini bastırır.' },
      { t: 'mc', q: 'shaper_type varsayılanı?', o: ['mzv', 'zv', 'ei', '2hump_ei'], a: 0, e: 'Varsayılan mzv (parametresiz).' },
      { t: 'order', q: 'İvmeölçerle input shaper ayarı', items: ['ACCELEROMETER_QUERY', 'G28', 'SHAPER_CALIBRATE', 'SAVE_CONFIG'], e: 'Önce ivmeölçer çalışıyor mu bak, home et, kalibre et, kaydet.' },
      { t: 'tf', q: 'shaper_freq_x: 0 X ekseni için input shaping\'i kapatır.', a: true, e: 'Varsayılan 0\'dır ve shaping kapalı demektir.' },
      { t: 'mc', q: 'ADXL345 bağlantısının çalıştığını hızlıca test etmek için?', o: ['ACCELEROMETER_QUERY', 'SHAPER_CALIBRATE', 'QUERY_ADC', 'STATUS'], a: 0, e: 'Dönen değerlerden biri yerçekimi ivmesine (~9800 mm/s²) yakın olmalı.' },
      { t: 'mc', q: 'SHAPER_CALIBRATE ölçüm verisini nereye yazar?', o: ['/tmp/calibration_data_<eksen>_<ad>.csv', 'printer.cfg', 'klippy.log', 'SD karta'], a: 0, e: 'CSV dosyaları /tmp altına yazılır; grafik çizmek için scripts/calibrate_shaper.py kullanılır.' },
      { t: 'match', q: 'Eşleştir', pairs: [['SHAPER_CALIBRATE', 'Ölç ve shaper öner'], ['TEST_RESONANCES', 'Sadece rezonans ölç'], ['SET_INPUT_SHAPER', 'Çalışırken değiştir'], ['[input_shaper]', 'Kalıcı ayar']], e: 'SHAPER_CALIBRATE sonrası SAVE_CONFIG ile config\'e yazılır.' }
    ]
  },
  {
    id: 'u8l3', title: 'TMC sürücüler', doc: 'TMC_Drivers.html',
    teach: [
      { title: 'UART ile sürücü ayarı', body: 'TMC2209 gibi sürücülerin akımını ve modunu config\'ten ayarlarsın. Bölüm adı **tmc2209 + stepper adı**:', code: '[tmc2209 stepper_x]\nuart_pin: PC11\nrun_current: 0.580\nstealthchop_threshold: 999999' },
      { title: 'Sensörsüz homing', body: 'Endstop yerine motorun yük algısını kullanır:', code: '[tmc2209 stepper_x]\ndiag_pin: ^PA1\ndriver_SGTHRS: 100   # 255 en hassas, 0 en az\n\n[stepper_x]\nendstop_pin: tmc2209_stepper_x:virtual_endstop\nhoming_retract_dist: 0' }
    ],
    questions: [
      { t: 'fill', q: 'X motorunun TMC2209 bölümü', code: '[___ stepper_x]\nuart_pin: PC11\nrun_current: 0.6', o: ['tmc2209', 'driver', 'tmc', 'stepper_tmc'], a: 'tmc2209', e: 'Bölüm adı sürücü modeli + stepper adıdır.' },
      { t: 'mc', q: 'Motor akımını baskı sırasında değiştiren komut?', o: ['SET_TMC_CURRENT STEPPER=stepper_x CURRENT=0.7', 'M906 X700', 'SET_CURRENT X=0.7', 'DUMP_TMC CURRENT=0.7'], a: 0, e: 'SET_TMC_CURRENT çalışma ve bekleme akımını ayarlar.' },
      { t: 'mc', q: 'TMC2209\'da driver_SGTHRS için hangisi doğru?', o: ['255 en hassas, 0 en az hassas', '0 en hassas, 255 en az', 'Sadece 0 veya 1 olur', 'Akımı ayarlar'], a: 0, e: 'TMC2209\'da değer büyüdükçe çarpma algısı hassaslaşır.' },
      { t: 'fill', q: 'Sensörsüz homing için endstop pini', code: 'endstop_pin: ___', o: ['tmc2209_stepper_x:virtual_endstop', 'probe:z_virtual_endstop', '^PA1', 'stepper_x:diag'], a: 'tmc2209_stepper_x:virtual_endstop', e: 'diag_pin tanımlanınca bu sanal pin oluşur.' },
      { t: 'mc', q: 'Sürücünün tüm register değerlerini görmek için?', o: ['DUMP_TMC STEPPER=stepper_x', 'QUERY_TMC', 'GET_TMC', 'STATUS'], a: 0, e: 'DUMP_TMC teşhis için tüm registerları okur.' },
      { t: 'tf', q: 'Sürücünün gücü kesilip geri gelirse INIT_TMC ile tekrar başlatılabilir.', a: true, e: 'INIT_TMC registerları yeniden yazar.' },
      { t: 'tf', q: 'SET_TMC_FIELD günlük ayarlar için önerilen kalıcı yöntemdir.', a: false, e: 'Hayır, sadece düşük seviyeli teşhis içindir. Kalıcı değişiklik config\'e yazılır.' }
    ]
  }
  ]
},
{
  id: 'u9', title: 'Baskı Yönetimi ve Sorunlar', desc: 'Pause/resume, retraction, hata mesajları', color: '#64748b', icon: '🛠️',
  lessons: [
  {
    id: 'u9l1', title: 'Duraklat, devam et, iptal', doc: 'G-Codes.html#pause_resume',
    teach: [
      { title: '[pause_resume]', body: '• **PAUSE**: Baskıyı duraklatır, konumu kaydeder.\n• **RESUME**: Kaydedilen konuma dönüp devam eder (VELOCITY ile dönüş hızı).\n• **CLEAR_PAUSE**: Devam etmeden duraklama durumunu siler. Başlangıç G-code\'una koyman önerilir.\n• **CANCEL_PRINT**: Baskıyı iptal eder.' },
      { title: 'Dosyadan baskı ve nesne atlama', body: '• **[virtual_sdcard] path:** host\'taki G-code klasörünü tanımlar.\n• **SDCARD_PRINT_FILE FILENAME=…** baskıyı başlatır.\n• **[exclude_object]** ile baskı sırasında tek bir parçayı iptal edebilirsin: **EXCLUDE_OBJECT NAME=…**\n• Filaman sensörü: **[filament_switch_sensor]**, sorgu: **QUERY_FILAMENT_SENSOR**' }
    ],
    questions: [
      { t: 'mc', q: 'Önceki baskıdan kalan duraklatma durumunu temizlemek için başlangıç G-code\'una ne eklenir?', o: ['CLEAR_PAUSE', 'RESUME', 'CANCEL_PRINT', 'PAUSE'], a: 0, e: 'Dokümanın önerisi: her baskıya temiz bir pause durumuyla başlamak için CLEAR_PAUSE.' },
      { t: 'mc', q: 'Tablada 6 parça var, biri koptu. Diğerleri devam etsin, sadece o atlansın. Ne gerekir?', o: ['[exclude_object] + EXCLUDE_OBJECT NAME=…', 'CANCEL_PRINT', 'PAUSE', 'M112'], a: 0, e: 'exclude_object tek bir nesneyi baskıdan çıkarır. Dilimleyicinin nesne etiketlemesi açık olmalı.' },
      { t: 'fill', q: 'Duraklatılmış baskıya yavaşça dön', code: 'RESUME ___=20', o: ['VELOCITY', 'SPEED', 'F', 'RATE'], a: 'VELOCITY', e: 'RESUME VELOCITY=… kaydedilen konuma dönüş hızını belirler.' },
      { t: 'tf', q: 'virtual_sdcard ile Klipper host\'taki G-code dosyalarını doğrudan basabilir.', a: true, e: 'Mainsail/Fluidd de dosyaları böyle bastırır.' },
      { t: 'type', q: 'Filaman sensörünün durumunu soran komutu yaz (SENSOR parametresi olmadan)', a: ['QUERY_FILAMENT_SENSOR'], e: 'QUERY_FILAMENT_SENSOR SENSOR=<ad> ile sorgulanır.' },
      { t: 'mc', q: 'Klipper\'da M600 (filaman değiştir) nasıl kullanılır?', o: ['Hazır değildir; gcode_macro ile tanımlanır', 'Hazır gelir', '[m600] bölümü eklenir', 'Desteklenmez, hiç kullanılamaz'], a: 0, e: 'Klipper standart olmayan G-code\'ları makro ile tanımlamanı ister; M600 genelde PAUSE kullanan bir makro olarak yazılır.' }
    ]
  },
  {
    id: 'u9l2', title: 'Firmware retraction', doc: 'G-Codes.html#firmware_retraction',
    teach: [
      { title: 'G10 / G11', body: '[firmware_retraction] eklenince:\n• **G10**: Geri çek\n• **G11**: Geri it\nAyarlar baskı sırasında değiştirilebilir:', code: '[firmware_retraction]\nretract_length: 0.8\nretract_speed: 35\n\nSET_RETRACTION RETRACT_LENGTH=0.6 RETRACT_SPEED=40\nGET_RETRACTION' },
      { title: 'İpucu', body: 'Pressure advance\'i iyi ayarlamak gereken geri çekme miktarını azaltır. Farklı filamanlar için SET_RETRACTION genelde dilimleyicinin filaman başlangıç G-code\'una yazılır.' }
    ],
    questions: [
      { t: 'match', q: 'Eşleştir', pairs: [['G10', 'Geri çek'], ['G11', 'Geri it'], ['SET_RETRACTION', 'Ayarları değiştir'], ['GET_RETRACTION', 'Ayarları göster']], e: 'G10/G11 sadece [firmware_retraction] tanımlıysa çalışır.' },
      { t: 'fill', q: 'Geri çekme mesafesini 0.5 mm yap', code: 'SET_RETRACTION ___=0.5', o: ['RETRACT_LENGTH', 'LENGTH', 'DISTANCE', 'R'], a: 'RETRACT_LENGTH', e: 'Parametreler: RETRACT_LENGTH, RETRACT_SPEED, UNRETRACT_EXTRA_LENGTH, UNRETRACT_SPEED.' },
      { t: 'tf', q: 'İyi ayarlanmış pressure advance, gereken retraction miktarını azaltabilir.', a: true, e: 'Doküman bunu belirtiyor.' },
      { t: 'mc', q: 'UNRETRACT_EXTRA_LENGTH ne işe yarar?', o: ['Geri iterken çekilenden biraz fazla iter', 'Geri çekmeyi uzatır', 'Hızı artırır', 'Z hop yapar'], a: 0, e: 'Geri itme sırasında ek uzunluk ekler.' },
      { t: 'mc', q: 'G10 "Unknown command" hatası veriyor. Neden?', o: ['[firmware_retraction] bölümü yok', 'Nozul soğuk', 'Home yapılmamış', 'M83 verilmemiş'], a: 0, e: 'G10/G11 bu bölüm eklenmeden tanımlı değildir.' }
    ]
  },
  {
    id: 'u9l3', title: 'Hata mesajları', doc: 'FAQ.html',
    teach: [
      { title: 'Sık görülen hatalar', body: '• **Must home axis first** → Home yapılmadan hareket istendi. Önce G28.\n• **Move out of range** → Hareket position_min/max dışına çıkıyor.\n• **Extrude below minimum temp** → Nozul min_extrude_temp\'in altında.\n• **Heater … not heating at expected rate** → verify_heater; kablo, sensör veya kartuşu kontrol et.\n• **Unknown command** → Komut yok ya da ilgili bölüm config\'te tanımlı değil.' },
      { title: 'Nereye bakılır?', body: 'Ayrıntılı kayıtlar **klippy.log** dosyasındadır. Hata bildirirken bu dosya istenir.\n\nShutdown durumundan çıkmak için **FIRMWARE_RESTART**.' }
    ],
    questions: [
      { t: 'mc', q: 'Yazıcı açılınca G1 X50 verdin, "Must home axis first" hatası. Çözüm?', o: ['Önce G28', 'FIRMWARE_RESTART', 'position_max\'ı büyüt', 'M84'], a: 0, e: 'Klipper home yapılmamış eksende hareket etmez; tablaya/duvara çarpmayı önler.' },
      { t: 'mc', q: 'G1 X300 verdin, position_max: 235. Hangi hatayı alırsın?', o: ['Move out of range', 'Must home axis first', 'Unknown command', 'Timer too close'], a: 0, e: 'Hareket sınırların dışında.' },
      { t: 'match', q: 'Hatayı çözümle eşleştir', pairs: [['Must home axis first', 'G28 yap'], ['Extrude below minimum temp', 'Nozulu ısıt'], ['Unknown command: G10', '[firmware_retraction] ekle'], ['MCU shutdown', 'FIRMWARE_RESTART']], e: 'Hata mesajı genelde çözümü söyler.' },
      { t: 'mc', q: 'Klipper\'ın ayrıntılı log dosyasının adı?', o: ['klippy.log', 'printer.log', 'moonraker.cfg', 'error.txt'], a: 0, e: 'klippy.log; Mainsail/Fluidd\'de log klasöründen indirebilirsin.' },
      { t: 'tf', q: 'FAQ\'a göre motorlar M84 ile kapatıldıktan sonra Klipper eksenin home olduğunu unutur.', a: true, e: 'Motorlar serbest kalınca konum kesin değildir; tekrar home gerekir.' },
      { t: 'mc', q: '"Heater extruder not heating at expected rate" hatasında ilk ne kontrol edilir?', o: ['Termistör ve ısıtıcı kartuşunun bağlantısı', 'Bed mesh', 'Pressure advance', 'rotation_distance'], a: 0, e: 'Bu bir güvenlik hatasıdır. Önce donanımı kontrol et; ayarları gevşetmek son çare.' },
      { t: 'type', q: 'Shutdown durumundan çıkaran komutu yaz', a: ['FIRMWARE_RESTART'], e: 'FIRMWARE_RESTART hem host\'u hem MCU hata durumunu sıfırlar.' }
    ]
  }
  ]
}
);
