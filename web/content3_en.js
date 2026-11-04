// Klipper Learn — lesson content in English (Units 10-15).
window.KLIPPER_UNITS_EN = window.KLIPPER_UNITS_EN || [];
window.KLIPPER_UNITS_EN.push(
{
  id: 'u10', title: 'Install and Update', desc: 'Build firmware, flash the board, stay current', color: '#06b6d4', icon: '🧰',
  lessons: [
  {
    id: 'u10l1', title: 'Building firmware', doc: 'Installation.html#building-and-flashing-the-micro-controller',
    teach: [
      { title: 'make menuconfig', body: 'The Klipper code for the MCU is compiled on the host. Choices like which chip, which crystal, USB vs UART vs CAN are made in **make menuconfig**. The right settings are usually in the **comments at the top** of the example printer.cfg.\n\n**Q** to exit, **Y** to save. Then **make**.', code: 'cd ~/klipper/\nmake menuconfig\nmake' },
      { title: 'Flashing the board', body: 'Find the board\'s serial port name, then flash:', code: 'ls /dev/serial/by-id/*\n\nsudo service klipper stop\nmake flash FLASH_DEVICE=/dev/serial/by-id/usb-1a86_USB2.0-Serial-if00-port0\nsudo service klipper start' },
      { title: 'Flashing via SD card', body: 'Most STM32 and LPC boards are first flashed via **SD card**:\n• While flashing, **don\'t** connect the board to the host over USB (some boards get powered over USB and fail to flash).\n• Some boards rename the file to **firmware.cur** after flashing. Some stock boards need a **different file name** each time (firmware1.bin, firmware2.bin).\n• For RP2040: **make flash FLASH_DEVICE=first**, the board must be in boot mode.' }
    ],
    questions: [
      { t: 'mc', q: 'Where do you choose the MCU chip and communication interface?', o: ['make menuconfig', '[mcu] section of printer.cfg', 'Mainsail settings', 'moonraker.conf'], a: 0, e: 'Build options are chosen in make menuconfig; printer.cfg only configures the host side.' },
      { t: 'mc', q: 'Where do you quickly find the right menuconfig settings?', o: ['Comments at the top of the example printer.cfg', 'On the board\'s box', 'In klippy.log', 'In the slicer'], a: 0, e: 'The printer-*.cfg files in Klipper\'s config folder list the required menuconfig settings at the top.' },
      { t: 'order', q: 'Order for flashing over USB', items: ['make menuconfig', 'make', 'sudo service klipper stop', 'make flash FLASH_DEVICE=...', 'sudo service klipper start'], e: 'Stop the Klipper service while flashing so it doesn\'t hold the serial port.' },
      { t: 'type', q: 'Type the command that lists the persistent serial port names of connected boards', a: ['ls /dev/serial/by-id/*', 'ls /dev/serial/by-id', 'ls /dev/serial/by-id/'], e: 'by-id names don\'t change when the board restarts.' },
      { t: 'tf', q: 'When flashing via SD card it is recommended to keep the USB cable connected to the host.', a: false, e: 'The opposite: some boards get powered over USB and that can prevent flashing. Unplug USB.' },
      { t: 'mc', q: 'You flashed from SD; the board renamed firmware.bin. What does that mean?', o: ['Flash succeeded, the file became firmware.cur', 'The file is corrupt', 'The board went back to Marlin', 'Wrong SD format'], a: 0, e: 'Many boards rename the flashed file to firmware.cur so they don\'t flash it again on every boot.' },
      { t: 'mc', q: 'A stock board won\'t flash a new version with the same firmware.bin name. Fix?', o: ['Use a different file name each time (e.g. firmware2.bin)', 'make clean is enough', 'Format the board', 'Change baud'], a: 0, e: 'Some stock boards skip the flash when they see the same name.' },
      { t: 'fill', q: 'Flash an RP2040 board', code: 'make flash FLASH_DEVICE=___', o: ['first', 'rp2040', 'usb', 'auto'], a: 'first', e: 'RP2040 uses FLASH_DEVICE=first; the board must be in boot mode.' }
    ]
  },
  {
    id: 'u10l2', title: 'Host and first config', doc: 'Installation.html',
    teach: [
      { title: 'The host side', body: 'Klipper usually runs on an **SBC** (small board computer like a Raspberry Pi).\n\n• **Moonraker**: Klipper\'s web API. **Mainsail** and **Fluidd** talk through it.\n• **MainsailOS**: a ready-made Raspberry Pi image.\n• **KIAUH**: 3rd-party installer for Klipper, Moonraker and interfaces.\n• Desktop Linux variants are not recommended.' },
      { title: 'Starting printer.cfg', body: 'Klipper\'s **config** folder has ready files:\n• **printer-…** → specific printers\n• **generic-…** → when only the board is known\n\nPut the board\'s **by-id** path in [mcu]. Names like /dev/ttyUSB0 can shift to ttyUSB1 when the board restarts.', code: '[mcu]\nserial: /dev/serial/by-id/usb-1a86_USB2.0-Serial-if00-port0' }
    ],
    questions: [
      { t: 'mc', q: 'Through which software do Mainsail and Fluidd talk to Klipper?', o: ['Moonraker', 'OctoPrint', 'KIAUH', 'Cura'], a: 0, e: 'Moonraker is Klipper\'s web API layer.' },
      { t: 'mc', q: 'What is KIAUH?', o: ['A 3rd-party installer for Klipper and friends', 'A board model', 'A slicer', 'Klipper\'s official interface'], a: 0, e: 'Klipper Install And Update Helper; installs Klipper, Moonraker, Mainsail/Fluidd.' },
      { t: 'mc', q: 'No ready config for your printer, only the board model is known. Which file do you start from?', o: ['generic-<board>.cfg', 'printer-<printer>.cfg', 'example-delta.cfg', 'An empty file'], a: 0, e: 'generic- files give a start for the board; then adapt to your printer.' },
      { t: 'tf', q: 'Using /dev/serial/by-id/... in [mcu] serial is safer than /dev/ttyUSB0.', a: true, e: 'ttyUSB0 can shift to ttyUSB1 on a board reset; the by-id name is stable.' },
      { t: 'tf', q: 'A desktop Linux variant is recommended for the Klipper host.', a: false, e: 'The docs don\'t recommend desktop variants; some helper programs can break Klipper\'s access to the board.' },
      { t: 'fill', q: 'Set the board\'s serial port', code: '[mcu]\n___: /dev/serial/by-id/usb-Klipper_stm32f446xx-if00', o: ['serial', 'port', 'device', 'path'], a: 'serial', e: 'The [mcu] section uses the serial: option.' },
      { t: 'mc', q: 'The by-id name changed after flashing. What do you do?', o: ['Get the new name with ls /dev/serial/by-id/* and update [mcu] serial', 'Nothing, Klipper finds it', 'Go back to Marlin', 'Set baud to 115200'], a: 0, e: 'The docs say the name can change after flashing and to check again.' }
    ]
  },
  {
    id: 'u10l3', title: 'Updating', doc: 'FAQ.html#how-do-i-upgrade-to-the-latest-software',
    teach: [
      { title: 'Read first, then update', body: 'Before updating, check **Config_Changes**: sometimes option names change. (The app\'s **News** tab shows exactly this.)\n\nIf only the host is updated:', code: 'cd ~/klipper\ngit pull\nsudo service klipper restart' },
      { title: 'Does the MCU need updating too?', body: 'If Klipper says to reflash the MCU or gives a **protocol error**, the MCU firmware is old: rebuild and flash.\n\n⚠️ RESTART and FIRMWARE_RESTART **don\'t load new software**; they only restart.', code: 'make menuconfig\nmake clean\nmake\nsudo service klipper stop\nmake flash FLASH_DEVICE=/dev/serial/by-id/...\nsudo service klipper start' }
    ],
    questions: [
      { t: 'mc', q: 'Which document should you check before updating Klipper?', o: ['Config_Changes', 'Benchmarks', 'Contact', 'Sponsors'], a: 0, e: 'Backwards-incompatible config changes are listed there.' },
      { t: 'order', q: 'Update only the host software', items: ['cd ~/klipper', 'git pull', 'sudo service klipper restart'], e: 'If the MCU code didn\'t change, this shortcut is enough.' },
      { t: 'tf', q: 'FIRMWARE_RESTART loads the new version of Klipper.', a: false, e: 'No. New software needs git pull + service restart, and make flash for the MCU.' },
      { t: 'mc', q: 'After an update you get a protocol error: "frequently caused by running an older version of the firmware". What do you do?', o: ['Rebuild and flash the MCU firmware', 'Delete printer.cfg', 'Uninstall Mainsail', 'RESTART is enough'], a: 0, e: 'If the host is new and the MCU is old, protocols don\'t match. Klipper asks you to reflash.' },
      { t: 'mc', q: 'What does make clean do before building?', o: ['Deletes previous build files for a clean build', 'Resets the board', 'Cleans printer.cfg', 'Deletes logs'], a: 0, e: 'make clean is part of the full upgrade steps in the FAQ.' },
      { t: 'type', q: 'Type the command that restarts the Klipper service', a: ['sudo service klipper restart', 'sudo systemctl restart klipper'], e: 'sudo service klipper restart (systemctl works too).' }
    ]
  }
  ]
},
{
  id: 'u11', title: 'Slicer and Interface', desc: 'START_PRINT, slicer settings, Mainsail', color: '#8b5cf6', icon: '🖥️',
  lessons: [
  {
    id: 'u11l1', title: 'Slicer settings', doc: 'Slicers.html',
    teach: [
      { title: 'Slicers with Klipper', body: '• G-code flavor: choose **Marlin** (Smoothieware works too).\n• Don\'t write long start/end code in the slicer. Write **START_PRINT** and **END_PRINT** macros in Klipper and put only those in the slicer. No re-slicing needed for changes.\n• Don\'t enable **coasting**; disable "advanced extruder pressure" options. Use **pressure advance** instead.' },
      { title: 'Sending parameters', body: 'Send temperatures from the slicer to the macro:', code: '; PrusaSlicer / OrcaSlicer\nSTART_PRINT BED_TEMP=[first_layer_bed_temperature] EXTRUDER_TEMP=[first_layer_temperature]\n\n; Cura\nSTART_PRINT BED_TEMP={material_bed_temperature_layer_0} EXTRUDER_TEMP={material_print_temperature_layer_0}' }
    ],
    questions: [
      { t: 'mc', q: 'Which G-code flavor do you pick in the slicer for Klipper?', o: ['Marlin', 'RepRapFirmware', 'Makerbot', 'Mach3'], a: 0, e: 'The docs recommend Marlin; Smoothieware also works.' },
      { t: 'tf', q: 'Putting start code into a START_PRINT macro in Klipper removes the need to re-slice when it changes.', a: true, e: 'Change the macro and RESTART.' },
      { t: 'mc', q: 'What do the docs say about the slicer "coasting" feature?', o: ['Don\'t enable it; use pressure advance', 'Always enable it', 'Only for PETG', 'Required in Klipper'], a: 0, e: 'Coasting hurts print quality with Klipper.' },
      { t: 'fill', q: 'PrusaSlicer start code', code: 'START_PRINT BED_TEMP=___', o: ['[first_layer_bed_temperature]', '{bed}', '$BED', 'S60'], a: '[first_layer_bed_temperature]', e: 'PrusaSlicer/OrcaSlicer use square-bracket placeholders.' },
      { t: 'mc', q: 'You set a 6 mm retraction in the slicer and retracts are slow. Which Klipper setting do you check?', o: ['max_extrude_only_velocity and max_extrude_only_accel', 'max_velocity', 'square_corner_velocity', 'homing_speed'], a: 0, e: 'These are the speed/accel limits of extrude-only moves. But first consider reducing retraction with pressure advance.' },
      { t: 'mc', q: 'To see layer count in Mainsail, what goes into the slicer\'s layer change code?', o: ['SET_PRINT_STATS_INFO CURRENT_LAYER={layer_num + 1}', 'M117 layer', 'LAYER_CHANGE', 'G92 L1'], a: 0, e: 'SET_PRINT_STATS_INFO passes TOTAL_LAYER and CURRENT_LAYER to Klipper.' }
    ]
  },
  {
    id: 'u11l2', title: 'Writing START_PRINT', doc: 'Slicers.html#klipper-gcode_macro',
    teach: [
      { title: 'A typical START_PRINT', body: 'Temperatures come in as parameters; order matters:', code: '[gcode_macro START_PRINT]\ngcode:\n  {% set BED = params.BED_TEMP|default(60)|float %}\n  {% set EXT = params.EXTRUDER_TEMP|default(200)|float %}\n  CLEAR_PAUSE\n  M140 S{BED}\n  G28\n  M190 S{BED}\n  BED_MESH_CALIBRATE ADAPTIVE=1\n  M109 S{EXT}\n  G92 E0' },
      { title: 'END_PRINT', body: 'When done: retract a bit, raise the head, turn off heaters and fan, release motors, clear the mesh.', code: '[gcode_macro END_PRINT]\ngcode:\n  G91\n  G1 E-2 F2700\n  G1 Z10 F600\n  G90\n  TURN_OFF_HEATERS\n  M107\n  M84\n  BED_MESH_CLEAR' }
    ],
    questions: [
      { t: 'order', q: 'A sensible order inside START_PRINT', items: ['M140 S{BED}', 'G28', 'M190 S{BED}', 'BED_MESH_CALIBRATE', 'M109 S{EXT}'], e: 'Home while the bed starts heating; mesh after the bed is hot (expansion); heat the nozzle last so it doesn\'t ooze.' },
      { t: 'mc', q: 'Why take the mesh AFTER the bed is hot?', o: ['The bed changes shape slightly when hot', 'The probe doesn\'t work cold', 'Klipper requires it', 'It is faster'], a: 0, e: 'Thermal expansion changes the bed surface; measure at printing temperature.' },
      { t: 'mc', q: 'Why put CLEAR_PAUSE at the start of START_PRINT?', o: ['To clear a leftover pause state from the last print', 'To pause the print', 'To turn off the fan', 'To delete the mesh'], a: 0, e: 'The docs recommend it in start code.' },
      { t: 'tf', q: 'If the slicer sends BED_TEMP=60, params.BED_TEMP arrives as text; math needs |float.', a: true, e: 'Parameters always arrive as strings.' },
      { t: 'match', q: 'Match the END_PRINT lines with their jobs', pairs: [['TURN_OFF_HEATERS', 'Turn off heaters'], ['M107', 'Turn off part fan'], ['M84', 'Release motors'], ['BED_MESH_CLEAR', 'Turn off mesh']], e: 'All typical end steps.' },
      { t: 'mc', q: 'Why use G91 before G1 Z10 in END_PRINT?', o: ['So it rises 10 mm from where it is', 'It doesn\'t matter', 'To turn on the fan', 'To home'], a: 0, e: 'In absolute mode Z10 on a tall print could drive the nozzle down into the part.' }
    ]
  },
  {
    id: 'u11l3', title: 'Moonraker and Mainsail', doc: 'Installation.html#interacting-with-klipper',
    teach: [
      { title: 'The interface layer', body: '• **Klipper**: drives the printer.\n• **Moonraker**: Klipper\'s web API. Configured in **moonraker.conf**. Its update manager lets you update Klipper and the interface from the UI.\n• **Mainsail / Fluidd**: browser interface.\n• **OctoPrint** also works with Klipper.' },
      { title: 'Sections the interface wants', body: 'To upload and print files, pause, and show progress, printer.cfg needs:', code: '[virtual_sdcard]\npath: ~/printer_data/gcodes\n\n[pause_resume]\n\n[display_status]\n\n[exclude_object]' }
    ],
    questions: [
      { t: 'mc', q: 'Name of Moonraker\'s config file?', o: ['moonraker.conf', 'printer.cfg', 'mainsail.json', 'klippy.log'], a: 0, e: 'Moonraker keeps its own settings in moonraker.conf.' },
      { t: 'mc', q: 'Which section is required to print G-code files from Mainsail?', o: ['[virtual_sdcard]', '[bed_mesh]', '[input_shaper]', '[force_move]'], a: 0, e: 'virtual_sdcard lets Klipper print files on the host.' },
      { t: 'tf', q: 'OctoPrint can also be used with Klipper.', a: true, e: 'The docs list Moonraker-based interfaces and OctoPrint as options.' },
      { t: 'mc', q: 'What is needed for Mainsail\'s "cancel one object" button to work?', o: ['[exclude_object] and object labeling in the slicer', '[pause_resume]', '[skew_correction]', '[save_variables]'], a: 0, e: 'The slicer must write object names into the G-code; Klipper recognizes them with exclude_object.' },
      { t: 'match', q: 'Match', pairs: [['Klipper', 'Drives the printer'], ['Moonraker', 'Web API'], ['Mainsail', 'Browser interface'], ['KIAUH', 'Installer']], e: 'Each layer can be updated separately.' }
    ]
  }
  ]
},
{
  id: 'u12', title: 'Fans, LEDs, Sensors', desc: 'Every fan type, neopixel, filament sensor', color: '#0ea5e9', icon: '🌀',
  lessons: [
  {
    id: 'u12l1', title: 'Fan types', doc: 'Config_Reference.html#fan',
    teach: [
      { title: 'Which fan, which section?', body: '• **[fan]**: part cooling fan, controlled by M106/M107.\n• **[heater_fan …]**: runs while the hotend heater is on. Keeps spinning until the heater drops below **heater_temp** (default **50 °C**).\n• **[controller_fan …]**: runs the board fan while drivers or heaters are active.\n• **[temperature_fan …]**: runs when a sensor exceeds the target (default **40 °C**).\n• **[fan_generic …]**: manual control, **SET_FAN_SPEED FAN=… SPEED=…**' },
      { title: 'Common options', body: '• **max_power**: maximum power (0-1)\n• **kick_start_time** (0.100 s): brief full power when the fan starts\n• **off_below**: requests below this turn the fan off (against stall issues)\n• **hardware_pwm**: hardware PWM', code: '[heater_fan hotend_fan]\npin: PB15\nheater: extruder\nheater_temp: 50.0' }
    ],
    questions: [
      { t: 'mc', q: 'Which section for the hotend (heatbreak) cooling fan?', o: ['[heater_fan …]', '[fan]', '[fan_generic …]', '[output_pin …]'], a: 0, e: 'heater_fan runs automatically while its heater is on.' },
      { t: 'mc', q: 'Print done, heater off, but the hotend fan keeps spinning. Why?', o: ['It runs until the nozzle drops below heater_temp (50 °C)', 'There is a fault', 'No M107', 'Fan wired backwards'], a: 0, e: 'It keeps heat from creeping up until it cools; this is normal.' },
      { t: 'mc', q: 'Which fan cools the board drivers and runs while motors are active?', o: ['[controller_fan …]', '[heater_fan …]', '[temperature_fan …]', '[fan]'], a: 0, e: 'controller_fan runs while a driver or heater is active and stops after idle_timeout.' },
      { t: 'fill', q: 'Set a manually controlled aux fan to 50%', code: '___ FAN=aux SPEED=0.5', o: ['SET_FAN_SPEED', 'M106', 'SET_PIN', 'FAN_SPEED'], a: 'SET_FAN_SPEED', e: 'fan_generic uses SET_FAN_SPEED; speed is 0.0-1.0.' },
      { t: 'mc', q: 'An exhaust fan should start when the enclosure exceeds 40 °C. Which section?', o: ['[temperature_fan …]', '[heater_fan …]', '[controller_fan …]', '[fan]'], a: 0, e: 'temperature_fan watches a sensor; target_temp defaults to 40 °C.' },
      { t: 'mc', q: 'The fan stalls at low speeds. Which setting helps?', o: ['off_below and kick_start_time', 'max_velocity', 'heater_temp', 'pid_Kp'], a: 0, e: 'kick_start_time spins it up at full power first; off_below turns very low speeds fully off.' },
      { t: 'tf', q: 'M106/M107 control the part fan in the [fan] section.', a: true, e: 'Other fan types follow their own rules or SET_FAN_SPEED.' }
    ]
  },
  {
    id: 'u12l2', title: 'LEDs and output pins', doc: 'G-Codes.html#led',
    teach: [
      { title: 'Neopixel', body: 'WS2812-style addressable LEDs:', code: '[neopixel case]\npin: PB0\nchain_count: 24\ncolor_order: GRB\n\nSET_LED LED=case RED=1 GREEN=0.4 BLUE=0\nSET_LED LED=case RED=0 GREEN=1 BLUE=0 INDEX=3' },
      { title: 'output_pin', body: 'Switch a pin by hand (relay, LED strip, buzzer):\n• **pwm: False** → value 0 or 1\n• **pwm: True** → value 0.0-1.0\n\nCommand: **SET_PIN PIN=… VALUE=…**', code: '[output_pin light]\npin: PA8\npwm: True\n\nSET_PIN PIN=light VALUE=0.5' }
    ],
    questions: [
      { t: 'mc', q: 'What range are SET_LED color values?', o: ['0.0 - 1.0', '0 - 255', '0 - 100', '0 - 1023'], a: 0, e: 'Klipper LED colors are 0.0-1.0 (don\'t mix up with M106\'s 0-255).' },
      { t: 'mc', q: 'On a 24-LED strip, to make only LED 3 green?', o: ['SET_LED LED=case GREEN=1 INDEX=3', 'SET_LED LED=case3 GREEN=1', 'SET_LED LED=case GREEN=255 N=3', 'SET_PIN PIN=case VALUE=3'], a: 0, e: 'INDEX selects one LED in the chain (starting at 1).' },
      { t: 'mc', q: 'Default neopixel color_order?', o: ['GRB', 'RGB', 'BGR', 'RGBW'], a: 0, e: 'Default GRB. If colors look wrong, change this.' },
      { t: 'fill', q: 'Turn off the case light', code: 'SET_PIN PIN=light ___=0', o: ['VALUE', 'S', 'POWER', 'STATE'], a: 'VALUE', e: 'SET_PIN PIN=… VALUE=…' },
      { t: 'tf', q: 'Giving VALUE=0.5 to an output_pin with pwm: False makes sense.', a: false, e: 'A non-PWM pin only takes 0 or 1.' },
      { t: 'mc', q: 'You changed an LED while idle and it reset the idle timeout. Which parameter avoids this?', o: ['SYNC=0', 'TRANSMIT=0', 'INDEX=0', 'QUIET=1'], a: 0, e: 'SYNC=0 applies the change without syncing to the G-code stream; the idle timeout isn\'t reset.' }
    ]
  },
  {
    id: 'u12l3', title: 'Sensors', doc: 'Config_Reference.html#filament_switch_sensor',
    teach: [
      { title: 'Extra temperature sensors', body: 'To show enclosure or Raspberry Pi temperature:', code: '[temperature_sensor raspberry_pi]\nsensor_type: temperature_host\n\n[temperature_sensor enclosure]\nsensor_type: Generic 3950\nsensor_pin: PA3' },
      { title: 'Filament runout sensor', body: '• **pause_on_runout** (default **True**): PAUSE when filament runs out.\n• **runout_gcode**: commands to run on runout.\n• **insert_gcode**: when filament is inserted.\n• **event_delay** (3 s): minimum time between events.\n\nCommands: **QUERY_FILAMENT_SENSOR SENSOR=…**, **SET_FILAMENT_SENSOR SENSOR=… ENABLE=0**', code: '[filament_switch_sensor runout]\nswitch_pin: ^PC2\npause_on_runout: True' }
    ],
    questions: [
      { t: 'mc', q: 'sensor_type to show the Raspberry Pi CPU temperature in Mainsail?', o: ['temperature_host', 'raspberry_pi', 'host_cpu', 'Generic 3950'], a: 0, e: 'temperature_host reads the host computer\'s temperature file.' },
      { t: 'tf', q: 'pause_on_runout is on by default in filament_switch_sensor.', a: true, e: 'Default True: the print pauses on runout ([pause_resume] required).' },
      { t: 'mc', q: 'To temporarily disable the sensor during a filament change?', o: ['SET_FILAMENT_SENSOR SENSOR=runout ENABLE=0', 'QUERY_FILAMENT_SENSOR ENABLE=0', 'M412 S0', 'SET_PIN PIN=runout VALUE=0'], a: 0, e: 'SET_FILAMENT_SENSOR enables/disables it.' },
      { t: 'mc', q: 'An auto-load macro should run when filament is inserted. Which option?', o: ['insert_gcode', 'runout_gcode', 'event_delay', 'pause_delay'], a: 0, e: 'Without insert_gcode, insert detection is disabled.' },
      { t: 'match', q: 'Match', pairs: [['[temperature_sensor]', 'Only shows temperature'], ['[temperature_fan]', 'Fan by temperature'], ['[heater_generic]', 'Extra heater (chamber)'], ['[filament_switch_sensor]', 'Filament runout detection']], e: 'Similar names, different jobs.' },
      { t: 'mc', q: 'What do you do for a thermistor not in Klipper\'s list?', o: ['Define it with a [thermistor my_name] section (coefficients or measured points)', 'Recompile firmware', 'It can\'t be used', 'Write sensor_type: custom'], a: 0, e: 'The [thermistor] section defines a custom thermistor; then sensor_type: my_name.' }
    ]
  }
  ]
},
{
  id: 'u13', title: 'Multi-MCU and CAN', desc: 'Toolhead boards, CAN bus, connection issues', color: '#10b981', icon: '🔗',
  lessons: [
  {
    id: 'u13l1', title: 'Multiple MCUs', doc: 'Config_Reference.html#mcu-my_extra_mcu',
    teach: [
      { title: 'Adding an extra board', body: 'For an extra board (toolhead board, second mainboard) add an **[mcu name]** section. That board\'s pins are written as **name:PIN**.', code: '[mcu ebb]\ncanbus_uuid: 11aa22bb33cc\n\n[extruder]\nstep_pin: ebb:PD0\nheater_pin: ebb:PB13\nsensor_pin: ebb:PA3' },
      { title: 'The Raspberry Pi can be an MCU too', body: 'You can use the host as an MCU and use its pins (accelerometer, GPIO). Install the Linux MCU service; it connects via **/tmp/klipper_host_mcu**.', code: '[mcu rpi]\nserial: /tmp/klipper_host_mcu' }
    ],
    questions: [
      { t: 'fill', q: 'Use pin PB13 of the toolhead board named "ebb"', code: 'heater_pin: ___', o: ['ebb:PB13', 'PB13@ebb', 'ebb.PB13', '[ebb] PB13'], a: 'ebb:PB13', e: 'Extra MCU pins are written "mcu_name:pin".' },
      { t: 'mc', q: 'Which section adds a second mainboard?', o: ['[mcu second]', '[board second]', '[mcu2]', '[extra_mcu]'], a: 0, e: 'You can define any number of extra MCUs with the "mcu" prefix.' },
      { t: 'mc', q: 'Serial path when adding the Raspberry Pi as an MCU?', o: ['/tmp/klipper_host_mcu', '/dev/ttyAMA0', '/dev/serial/by-id/rpi', 'localhost'], a: 0, e: 'The Linux MCU service connects through /tmp/klipper_host_mcu.' },
      { t: 'tf', q: 'Homing works even if the endstop is on one board and the motor on another (multi-mcu homing).', a: true, e: 'Klipper calls it "multi-mcu homing" and does it by syncing clocks.' },
      { t: 'mc', q: 'The biggest practical benefit of a toolhead board?', o: ['Far fewer wires to the toolhead', 'Print speed doubles automatically', 'No probe needed', 'No firmware updates needed'], a: 0, e: 'Heater, thermistor, fans and extruder motor connect to the toolhead board; only CAN/power goes to the mainboard.' },
      { t: 'mc', q: '"Permission denied" on /tmp/klipper_host_mcu. Fix?', o: ['Add the user to the tty group', 'Reflash the board', 'Change CAN speed', 'Delete printer.cfg'], a: 0, e: 'Docs: sudo usermod -a -G tty pi' }
    ]
  },
  {
    id: 'u13l2', title: 'CAN bus setup', doc: 'CANBUS.html',
    teach: [
      { title: 'Hardware', body: '• Klipper supports CAN on **stm32, SAME5x and rp2040** chips; the board needs a CAN transceiver.\n• The host needs a **USB-CAN adapter** (candlelight firmware), or a board acts as adapter in **USB to CAN bridge** mode.\n• The bus needs **two 120 Ω** terminating resistors. With power off, CANH-CANL should read **~60 Ω**.' },
      { title: 'Linux side and UUID', body: '', code: '# /etc/network/interfaces.d/can0\nallow-hotplug can0\niface can0 can static\n    bitrate 1000000\n    up ip link set $IFACE txqueuelen 128\n\n# find the UUID\n~/klippy-env/bin/python ~/klipper/scripts/canbus_query.py can0\n\n[mcu ebb]\ncanbus_uuid: 11aa22bb33cc' }
    ],
    questions: [
      { t: 'mc', q: 'With correct termination (power off), how many ohms between CANH and CANL?', o: ['~60 Ω', '~120 Ω', '~0 Ω', '~240 Ω'], a: 0, e: 'Two 120 Ω resistors in parallel → 60 Ω.' },
      { t: 'mc', q: 'The meter reads 120 Ω. What does it mean?', o: ['Only one terminating resistor', 'All good', 'Broken wire', 'Three resistors'], a: 0, e: 'One resistor reads 120 Ω; the other end of the bus also needs one (jumper).' },
      { t: 'fill', q: 'Bitrate in the can0 config', code: 'iface can0 can static\n    bitrate ___', o: ['1000000', '250000', '115200', '500'], a: '1000000', e: 'The doc example is 1 Mbit (1000000). All devices must use the same speed.' },
      { t: 'mc', q: 'canbus_query.py doesn\'t show the new toolhead board, but Klipper is already connected to it. Why?', o: ['The tool only lists devices Klipper hasn\'t configured yet', 'Board is broken', 'Wrong bitrate', 'Board is in USB mode'], a: 0, e: 'Once Klipper configures a device it no longer appears in the list.' },
      { t: 'tf', q: 'In USB to CAN bridge mode, CAN speed comes from make menuconfig, not the Linux bitrate.', a: true, e: 'Docs: in bridge mode the Linux speed setting is ignored.' },
      { t: 'mc', q: 'The can0 interface goes down when the bridge board resets. Which setting tolerates this?', o: ['allow-hotplug can0', 'auto can0', 'txqueuelen 1024', 'restart_method: command'], a: 0, e: 'The docs recommend allow-hotplug so FIRMWARE_RESTART/RESTART work properly.' },
      { t: 'type', q: 'Type the name of the option that identifies an MCU on CAN', a: ['canbus_uuid'], e: 'Written as canbus_uuid: … in the [mcu …] section.' }
    ]
  },
  {
    id: 'u13l3', title: 'Connection problems', doc: 'FAQ.html#i-keep-getting-random-lost-communication-with-mcu-errors',
    teach: [
      { title: '"Lost communication with MCU"', body: 'Usually a **hardware** problem:\n• Good quality, firmly seated USB cable\n• Good power supply for the Raspberry Pi (fix any "under voltage" warning)\n• Printer PSU not overloaded\n• Crimped or chafed motor/heater wires\n• Printer 5V and host 5V mixing can cause noise' },
      { title: '"Unable to connect"', body: 'Klipper can\'t reach the board at all:\n• [mcu] **serial** path wrong or changed (check by-id)\n• No Klipper firmware on the board yet\n• On CAN, wrong **canbus_uuid** or can0 is down' }
    ],
    questions: [
      { t: 'mc', q: 'Random "Lost communication with MCU" during prints. First suspect?', o: ['USB cable and power supplies', 'PID values', 'Pressure advance', 'Bed mesh'], a: 0, e: 'The first items in the FAQ are cables and power.' },
      { t: 'tf', q: 'An "under voltage" warning on the Raspberry Pi can be ignored.', a: false, e: 'FAQ: it is a power supply problem and must be fixed.' },
      { t: 'mc', q: 'With the printer off, the board LEDs light up when only USB is plugged in. What can this indicate?', o: ['5V supplies are mixing; can cause noise', 'Normal and good', 'Board is on Marlin', 'Missing CAN termination'], a: 0, e: 'FAQ: if the board powers from either source, 5V is mixing; powering from one source is recommended.' },
      { t: 'mc', q: '"Unable to connect" on a new install. Most likely cause?', o: ['[mcu] serial path wrong or no Klipper firmware on the board', 'Bed is cold', 'No mesh', 'Filament ran out'], a: 0, e: 'If the host can\'t reach the board at all, the path or firmware is the problem.' },
      { t: 'mc', q: 'It seems to disconnect only when the head reaches a certain spot. What do you check?', o: ['Broken/crimped wires that flex with motion', 'Thermistor type', 'max_accel', 'Slicer'], a: 0, e: 'Motion stresses the cable; a broken strand causes brief drops or noise.' }
    ]
  }
  ]
},
{
  id: 'u14', title: 'Advanced Calibration', desc: 'BLTouch, skew, twist, custom homing', color: '#f43f5e', icon: '🧪',
  lessons: [
  {
    id: 'u14l1', title: 'BLTouch', doc: 'BLTouch.html',
    teach: [
      { title: '[bltouch]', body: 'Use **[bltouch]** instead of [probe]; it also creates **probe:z_virtual_endstop**.\n• **sensor_pin**: most need **^** (pull-up)\n• **control_pin**: the signal that deploys/stows the pin', code: '[bltouch]\nsensor_pin: ^PC14\ncontrol_pin: PA1\nx_offset: -44\ny_offset: -6\nz_offset: 2.1' },
      { title: 'Test commands', body: '**BLTOUCH_DEBUG COMMAND=…**\n• **pin_down** / **pin_up**: deploy/stow the pin\n• **self_test**: run its self test\n• **reset**: clear the error state (blinking red)\n• **touch_mode**\n\nFor V3.1: **BLTOUCH_STORE MODE=5V** or **OD**.' }
    ],
    questions: [
      { t: 'fill', q: 'Deploy the BLTouch pin', code: 'BLTOUCH_DEBUG COMMAND=___', o: ['pin_down', 'down', 'deploy', 'probe'], a: 'pin_down', e: 'Commands: pin_down, touch_mode, pin_up, self_test, reset.' },
      { t: 'mc', q: 'The BLTouch blinks red (error state). Which command resets it?', o: ['BLTOUCH_DEBUG COMMAND=reset', 'FIRMWARE_RESTART', 'BLTOUCH_STORE MODE=reset', 'PROBE'], a: 0, e: 'The reset command clears the BLTouch error state.' },
      { t: 'tf', q: 'For a BLTouch, both [probe] and [bltouch] sections should be added.', a: false, e: '[bltouch] is used instead of [probe].' },
      { t: 'mc', q: 'Which prefix does the BLTouch sensor_pin usually need?', o: ['^ (pull-up)', '! (invert)', '~ (pull-down)', 'None'], a: 0, e: 'Per the docs, most BLTouch sensor pins need a pull-up.' },
      { t: 'mc', q: 'To store the BLTouch V3.1 output mode in its EEPROM?', o: ['BLTOUCH_STORE MODE=5V', 'SAVE_CONFIG', 'BLTOUCH_DEBUG COMMAND=store', 'SAVE_VARIABLE'], a: 0, e: 'BLTOUCH_STORE MODE=5V or MODE=OD.' }
    ]
  },
  {
    id: 'u14l2', title: 'Skew and twist', doc: 'Skew_Correction.html',
    teach: [
      { title: 'Skew correction', body: 'If the axes aren\'t exactly 90°, squares come out as parallelograms. Print a calibration part and measure AC, BD, AD:', code: '[skew_correction]\n\nSET_SKEW XY=140.4,141.6,99.8\nSKEW_PROFILE SAVE=my_skew\nSAVE_CONFIG\n\n# in start code\nSKEW_PROFILE LOAD=my_skew' },
      { title: 'Axis twist compensation', body: 'If the X gantry is slightly twisted, the probe reads differently on the left and right of the bed. **[axis_twist_compensation]** corrects it:\n**AXIS_TWIST_COMPENSATION_CALIBRATE** (X if AXIS isn\'t given).' }
    ],
    questions: [
      { t: 'mc', q: 'Your printed square looks like a parallelogram. Which feature?', o: ['[skew_correction]', '[input_shaper]', '[bed_mesh]', '[axis_twist_compensation]'], a: 0, e: 'Skew correction fixes the angle error between axes.' },
      { t: 'fill', q: 'Enter the XY measurements', code: 'SET_SKEW ___=140.4,141.6,99.8', o: ['XY', 'AC', 'PLANE', 'SKEW'], a: 'XY', e: 'SET_SKEW XY=ac,bd,ad (XZ and YZ planes too).' },
      { t: 'tf', q: 'After SKEW_PROFILE SAVE, SAVE_CONFIG is needed to make it permanent.', a: true, e: 'Same as bed mesh profiles.' },
      { t: 'mc', q: 'The probe reads systematically different heights at the left and right edges; the bed is actually flat. Which feature?', o: ['[axis_twist_compensation]', '[skew_correction]', '[z_tilt]', '[safe_z_home]'], a: 0, e: 'Gantry twist tilts the probe; axis twist compensation corrects it.' },
      { t: 'mc', q: 'If AXIS isn\'t given to AXIS_TWIST_COMPENSATION_CALIBRATE, which axis?', o: ['X', 'Y', 'Z', 'Both'], a: 0, e: 'Default X.' },
      { t: 'mc', q: 'To measure remaining skew after correction is applied?', o: ['CALC_MEASURED_SKEW', 'GET_POSITION', 'SET_SKEW CLEAR=1', 'BED_MESH_OUTPUT'], a: 0, e: 'CALC_MEASURED_SKEW calculates skew from measurements; GET_CURRENT_SKEW shows the current setting.' }
    ]
  },
  {
    id: 'u14l3', title: 'Custom homing and diagnostics', doc: 'Config_Reference.html#homing_override',
    teach: [
      { title: '[homing_override]', body: 'Runs your own homing sequence instead of G28. Rules:\n• A G28 inside it calls the normal homing.\n• The script must home **all axes**.\n• **axes** defaults to xyz.\n• **set_position_z** makes Klipper assume a Z position before homing, so the head can be lifted first.', code: '[homing_override]\nset_position_z: 0\ngcode:\n  G90\n  G1 Z5 F600\n  G28 X Y\n  G1 X117 Y117 F6000\n  G28 Z' },
      { title: 'Diagnostic commands', body: '• With **[force_move] enable_force_move: True**:\n  - **FORCE_MOVE STEPPER=… DISTANCE=… VELOCITY=…**: moves one motor without limit checks\n  - **SET_KINEMATIC_POSITION**: "forces" Klipper to believe where the head is\n• **STEPPER_BUZZ STEPPER=…**: jiggles a motor back and forth to find which motor is on which socket.\n⚠️ These are for diagnosis; crash risk.' }
    ],
    questions: [
      { t: 'tf', q: 'A [homing_override] script can home only some axes and skip the rest.', a: false, e: 'Docs: the script must home all axes.' },
      { t: 'mc', q: 'To lift Z 5 mm before homing, Klipper must assume Z is at a known spot. Which option?', o: ['set_position_z', 'position_endstop', 'z_hop', 'homing_retract_dist'], a: 0, e: 'With set_position_z the homing check is disabled and Z can move.' },
      { t: 'mc', q: 'Wires got mixed; you want to find which motor is on which socket. Which command?', o: ['STEPPER_BUZZ STEPPER=stepper_x', 'QUERY_ENDSTOPS', 'DUMP_TMC', 'G28'], a: 0, e: 'STEPPER_BUZZ moves the motor 1 mm back and forth so you see which one moves.' },
      { t: 'mc', q: 'FORCE_MOVE gives "Unknown command". Why?', o: ['No [force_move] enable_force_move: True', 'Not homed', 'Motor off', 'TMC error'], a: 0, e: 'FORCE_MOVE and SET_KINEMATIC_POSITION are enabled by this option.' },
      { t: 'tf', q: 'FORCE_MOVE does not check axis limits (position_max).', a: true, e: 'The docs warn: no boundary checks; a wrong command can cause damage. G28 afterwards.' },
      { t: 'mc', q: 'To switch to the other head on an IDEX printer?', o: ['SET_DUAL_CARRIAGE CARRIAGE=…', 'ACTIVATE_EXTRUDER is enough', 'T1 is built in', 'SWITCH_HEAD'], a: 0, e: 'With [dual_carriage], SET_DUAL_CARRIAGE is used; T0/T1 are usually written as macros.' }
    ]
  }
  ]
},
{
  id: 'u15', title: 'Troubleshooting Cases', desc: 'Real error screens, make the diagnosis', color: '#dc2626', icon: '🚨',
  lessons: [
  {
    id: 'u15l1', title: 'MCU shutdown!', doc: 'FAQ.html',
    teach: [
      { title: 'Think like a technician', body: 'In this unit I show you a console output and you make the diagnosis.\n\nFor MCU shutdowns, look at the start of the message:\n• **Timer too close** → host overloaded (CPU, swap, heat, voltage)\n• **ADC out of range** → a temperature left min_temp/max_temp\n• **Stepper too far in past** / **Rescheduled timer in the past** → a step rate the MCU can\'t handle was requested\n• **Command request** → M112 or an internal host error\n\nOnce fixed: **FIRMWARE_RESTART**' }
    ],
    questions: [
      { t: 'mc', q: 'The console shows this. Most likely cause?', log: "!! MCU 'mcu' shutdown: Timer too close\n// This often indicates the host computer is overloaded.\n// Once the underlying issue is corrected, use the\n// \"FIRMWARE_RESTART\" command to reset the firmware", o: ['Host computer overloaded (CPU, swap, heat, voltage)', 'Thermistor disconnected', 'Faulty endstop', 'Filament ran out'], a: 0, e: 'Timer too close usually means the host couldn\'t send data in time: camera streaming, heavy plugins, SD card errors, a hot Pi.' },
      { t: 'mc', q: 'The printer was turned on in a cold garage at night and this appeared. The thermistor is fine. What happened?', log: "!! MCU 'mcu' shutdown: ADC out of range\n// This generally occurs when a heater temperature exceeds\n// its configured min_temp or max_temp.", o: ['Room is below min_temp (e.g. min_temp: 5, garage at 2 °C)', 'Host overloaded', 'USB cable', 'Bed mesh broken'], a: 0, e: 'ADC out of range: temperature left the min/max range. A too-high min_temp in a cold room does it too.' },
      { t: 'mc', q: 'This appeared suddenly while heating. What do you check first?', log: "!! MCU 'mcu' shutdown: ADC out of range\nextruder: target=210 temp=-14.2", o: ['Thermistor wire/connector (broken or unplugged)', 'PID values', 'max_velocity', 'Slicer'], a: 0, e: 'A negative reading typically means an open circuit (broken thermistor).' },
      { t: 'mc', q: 'You set microsteps: 256 and moved fast; this appeared. Why?', log: "!! MCU 'mcu' shutdown: Stepper too far in past\n// This generally occurs when the micro-controller has been\n// requested to step at a rate higher than it is capable of\n// obtaining.", o: ['The requested step rate exceeded the MCU\'s capability', 'Thermistor fault', 'CAN termination', 'Old firmware'], a: 0, e: 'Very high microsteps × high speed = too many steps per second. Lower microsteps or limit speed.' },
      { t: 'mc', q: 'What does this message mean?', log: "!! MCU 'mcu' shutdown: Command request\n// This generally occurs in response to an M112 G-Code command\n// or in response to an internal error in the host software.", o: ['Someone sent M112 or the host software hit an internal error', 'The board burned', 'Thermistor short', 'Bed is cold'], a: 0, e: 'Command request means the host asked for the shutdown: M112 or an internal error. Check klippy.log.' },
      { t: 'type', q: 'After fixing the problem, which command brings the printer out of shutdown?', a: ['FIRMWARE_RESTART'], e: 'Klipper\'s own message says FIRMWARE_RESTART too.' },
      { t: 'match', q: 'Match the error with its cause', pairs: [['Timer too close', 'Host overloaded'], ['ADC out of range', 'Temperature out of range'], ['Stepper too far in past', 'Step rate too high'], ['Command request', 'M112 / internal error']], e: 'These four cover most MCU shutdowns.' }
    ]
  },
  {
    id: 'u15l2', title: 'Homing and probe errors', doc: 'Config_checks.html',
    teach: [
      { title: 'Homing error messages', body: '• **No trigger on x after full movement** → the head went the full way but the endstop didn\'t trigger (wiring, wrong pin, sensorless sensitivity too low).\n• **Endstop x still triggered after retract** → still reads pressed after backing off (logic inverted: ! missing/extra, or switch stuck).\n• **Probe triggered prior to movement** → the probe reads triggered before it starts moving down.\n\nBest diagnostic tool: **QUERY_ENDSTOPS** (query once untouched and once pressed).' }
    ],
    questions: [
      { t: 'mc', q: 'This error after G28. The head ran to the end of X and hit the frame. Why?', log: "!! No trigger on x after full movement", o: ['X endstop didn\'t trigger: wiring, pin or sensorless sensitivity', 'Thermistor disconnected', 'Host overloaded', 'No mesh'], a: 0, e: 'Klipper moved the full distance but no trigger signal came.' },
      { t: 'mc', q: 'Without touching the endstop, QUERY_ENDSTOPS says this. Fix?', log: "> QUERY_ENDSTOPS\n// x:TRIGGERED y:open z:open", o: ['Add/remove the ! prefix on stepper_x endstop_pin', 'Reverse motor direction', 'Increase homing_speed', 'Plug the cable into Y'], a: 0, e: 'If it reads TRIGGERED when not pressed, the logic is inverted; flip it with !.' },
      { t: 'mc', q: 'Most likely cause of this error?', log: "!! Endstop x still triggered after retract", o: ['Endstop logic inverted or switch stuck pressed', 'Speed too low', 'No filament', 'Bad PID'], a: 0, e: 'If it still reads pressed after backing off, the signal is inverted or the switch is mechanically stuck.' },
      { t: 'mc', q: 'This appeared while homing Z with a BLTouch. What do you check?', log: "!! Probe triggered prior to movement", o: ['Probe already triggered: pin inverted (!), BLTouch in error mode, or pin_move_time too short', 'X endstop', 'Mesh profile', 'Filament sensor'], a: 0, e: 'The probe reads "triggered" before it starts moving. Test with QUERY_PROBE and BLTOUCH_DEBUG.' },
      { t: 'mc', q: 'With sensorless homing, X stops halfway thinking it\'s home. What do you do?', o: ['Lower driver_SGTHRS (less sensitive)', 'Set driver_SGTHRS to 255', 'Increase microsteps', 'Set homing_retract_dist to 10'], a: 0, e: 'On the TMC2209 255 is most sensitive; if it triggers early, lower the value.' },
      { t: 'order', q: 'Testing a newly installed endstop', items: ['QUERY_ENDSTOPS without touching it', 'See it reads "open"', 'Hold it pressed and QUERY_ENDSTOPS again', 'See it reads "TRIGGERED"'], e: 'Don\'t G28 before verifying both states.' }
    ]
  },
  {
    id: 'u15l3', title: 'Problems during a print', doc: 'FAQ.html',
    teach: [
      { title: 'Mid-print errors', body: '• **Heater extruder not heating at expected rate** → sensor came loose, weak cartridge, fan blowing on the hotend (no silicone sock).\n• **Move exceeds maximum extrusion** → a move exceeded max_extrude_cross_section (bad slicing, very thick line).\n• **Extrude only move too long** → a single extrusion exceeded max_extrude_only_distance (50 mm).\n• **Lost communication with MCU** → cable/power.\n\nAlways: **klippy.log**' }
    ],
    questions: [
      { t: 'mc', q: 'On the first layers, this error appears when the part fan goes to 100%. Likely cause?', log: "!! Heater extruder not heating at expected rate\n// Once the underlying issue is corrected, use the\n// \"FIRMWARE_RESTART\" command", o: ['The fan is cooling the heater block; silicone sock missing/torn', 'Endstop fault', 'CAN resistor', 'Host overloaded'], a: 0, e: 'The heater can\'t keep up with heat loss. Fit a sock, check fan direction; re-running PID with the fan on also helps.' },
      { t: 'mc', q: 'When does this error appear?', log: "!! Move exceeds maximum extrusion (0.912mm^2 vs 0.640mm^2)", o: ['When a move exceeds the allowed extrusion cross section', 'When the nozzle is cold', 'Without homing', 'When CAN drops'], a: 0, e: 'Default limit is 4 × nozzle_diameter². Usually a wrong nozzle size/volumetric setting in the slicer.' },
      { t: 'mc', q: 'This error in a filament load macro. Fix?', log: "!! Extrude only move too long (100.000mm vs 50.000mm)", o: ['Split the move into 50 mm pieces or raise max_extrude_only_distance', 'Cool the nozzle', 'Run G28', 'Flash firmware'], a: 0, e: 'A single extrusion move can\'t exceed the default 50 mm.' },
      { t: 'mc', q: 'A layer shift happened on a long print, no error message. First things to check?', o: ['Belt tension, pulley set screw, motor current and speed/accel', 'PID', 'Filament sensor', 'Moonraker'], a: 0, e: 'Shifts are usually mechanical or the motor lacks torque (low current, high accel).' },
      { t: 'tf', q: 'When you get an error, detailed info and events are in klippy.log.', a: true, e: 'klippy.log is requested when reporting errors (e.g. on the Klipper Discourse).' },
      { t: 'mc', q: 'A customer says "the board connection drops mid-print"; the Pi shows a lightning bolt icon. Advice?', o: ['Use a quality 5V power supply and cable', 'PID calibration', 'Input shaper', 'Redo the mesh'], a: 0, e: 'Lightning bolt = under voltage. Per the FAQ, fix the power supply first.' }
    ]
  }
  ]
}
);
