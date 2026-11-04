// Klipper Learn — lesson content in English (Units 1-5). Same ids/structure as content1.js.
window.KLIPPER_UNITS_EN = window.KLIPPER_UNITS_EN || [];
window.KLIPPER_UNITS_EN.push(
{
  id: 'u1', title: 'Intro to Klipper', desc: 'How Klipper works and where settings live', color: '#22c55e', icon: '🚀',
  lessons: [
  {
    id: 'u1l1', title: 'What is Klipper?', doc: 'Features.html',
    teach: [
      { title: 'Firmware with two brains', body: 'In Klipper the work is split in two:\n\n• **Host** (usually a small computer like a Raspberry Pi): does all the motion math.\n• **MCU** (the micro-controller on the printer board): executes the steps the host calculated, exactly on time.\n\nThat is why even old 8-bit boards can step fast and precisely.' },
      { title: 'All settings in one file', body: 'In Marlin you recompile and flash the firmware to change a setting. In Klipper every setting lives in **printer.cfg** on the host. Edit the file, send **RESTART**, done.', code: '[printer]\nkinematics: cartesian\nmax_velocity: 300\nmax_accel: 3000' }
    ],
    questions: [
      { t: 'mc', q: 'Who does the motion math (acceleration, step timing) in Klipper?', o: ['The host computer (e.g. Raspberry Pi)', 'The printer board (MCU)', 'The slicer', 'The printer screen'], a: 0, e: 'The math runs on the host; the MCU only executes the prepared steps on time.' },
      { t: 'tf', q: 'In Klipper you must recompile and flash the firmware every time you change a setting.', a: false, e: 'No. Settings live in printer.cfg; edit it and RESTART. You only flash when updating Klipper\'s MCU code.' },
      { t: 'mc', q: 'What is the name of Klipper\'s main config file?', o: ['printer.cfg', 'Configuration.h', 'klipper.ini', 'config.json'], a: 0, e: 'printer.cfg. Configuration.h is Marlin\'s file.' },
      { t: 'mc', q: 'What does "MCU" stand for?', o: ['Micro-controller', 'Main Control Unit Software', 'Motor Control Utility', 'Multi Core Unit'], a: 0, e: 'MCU = micro-controller, the chip on the printer board.' },
      { t: 'tf', q: 'Klipper can drive several micro-controllers at once (e.g. main board + toolhead board).', a: true, e: 'Yes. The host synchronizes their clocks; one board can run the extruder while another runs the rest.' },
      { t: 'match', q: 'Match each part with its job', pairs: [['Host', 'Calculates motion'], ['MCU', 'Executes steps on time'], ['printer.cfg', 'All the settings'], ['Mainsail / Fluidd', 'Web interface']], e: 'Mainsail and Fluidd are the browser interfaces for Klipper (via Moonraker).' },
      { t: 'mc', q: 'With what precision does Klipper schedule step events?', o: ['25 microseconds or better', '1 millisecond', '10 milliseconds', '1 second'], a: 0, e: 'Per the docs, each step event is scheduled with 25 µs precision or better.' }
    ]
  },
  {
    id: 'u1l2', title: 'printer.cfg structure', doc: 'Config_Reference.html',
    teach: [
      { title: 'Sections and options', body: 'The file is made of **sections**. A section name is in square brackets. The lines below it are **option: value**. Lines starting with **#** are comments.', code: '[stepper_x]\nstep_pin: PB13\ndir_pin: !PB12   # ! = invert direction\nmicrosteps: 16' },
      { title: 'include and SAVE_CONFIG', body: '**[include file.cfg]** pulls in another file (e.g. keep macros separate).\n\nCalibration results (PID, mesh, probe offset) are written by **SAVE_CONFIG** to a special block at the bottom of the file. Do not edit that block by hand.', code: '[include macros.cfg]\n\n#*# <---------------------- SAVE_CONFIG ---------------------->\n#*# DO NOT EDIT THIS BLOCK OR BELOW.' }
    ],
    questions: [
      { t: 'mc', q: 'How is a section written in printer.cfg?', o: ['[stepper_x]', '<stepper_x>', '{stepper_x}', 'stepper_x:'], a: 0, e: 'Section names go in square brackets.' },
      { t: 'fill', q: 'Complete the option line', code: 'max_velocity___ 300', o: [':', '=', ' ->', ';'], a: ':', e: 'Klipper options are usually written as "option: value".' },
      { t: 'mc', q: 'Which character starts a comment line in printer.cfg?', o: ['#', '//', '--', '%'], a: 0, e: 'Lines starting with # are comments; Klipper ignores them.' },
      { t: 'mc', q: 'You want macros in a separate file. What goes into printer.cfg?', o: ['[include macros.cfg]', 'import macros.cfg', '#include "macros.cfg"', '[load macros.cfg]'], a: 0, e: '[include file.cfg] adds another config file. Wildcards also work: [include configs/*.cfg]' },
      { t: 'tf', q: 'It is recommended to edit the #*# block that SAVE_CONFIG writes at the end of the file by hand.', a: false, e: 'No. Klipper manages that block. To change a value, redo the calibration and SAVE_CONFIG.' },
      { t: 'mc', q: 'What does SAVE_CONFIG do?', o: ['Writes calibration results to printer.cfg and restarts the host software', 'Saves the print to the SD card', 'Flashes the firmware', 'Only prints the settings'], a: 0, e: 'SAVE_CONFIG overwrites the main config file and restarts Klipper.' },
      { t: 'tf', q: 'A ! in front of a pin name means the pin works inverted (low = active).', a: true, e: 'Yes. ! means reverse polarity; e.g. dir_pin: !PB12 flips motor direction.' }
    ]
  },
  {
    id: 'u1l3', title: 'Restarts and status', doc: 'G-Codes.html#gcode',
    teach: [
      { title: 'RESTART or FIRMWARE_RESTART?', body: '• **RESTART**: the host reloads the config. It does not clear the MCU error state.\n• **FIRMWARE_RESTART**: like RESTART, but also clears the MCU error state.\n\nChanged the config? RESTART is enough. Got a "shutdown" error? You need FIRMWARE_RESTART.' },
      { title: 'Emergency stop', body: '**M112** is the emergency stop. Klipper goes into "shutdown" and stops everything. To run again, send **FIRMWARE_RESTART**.\n\n**STATUS** reports host status, **HELP** lists available commands.' }
    ],
    questions: [
      { t: 'mc', q: 'You edited printer.cfg. What is the simplest command to apply the changes?', o: ['RESTART', 'M112', 'SAVE_CONFIG', 'G28'], a: 0, e: 'RESTART makes the host reload the config.' },
      { t: 'mc', q: 'The printer hit an "MCU shutdown" error. Which command clears it?', o: ['FIRMWARE_RESTART', 'RESTART', 'M84', 'STATUS'], a: 0, e: 'RESTART does not clear the MCU error state; FIRMWARE_RESTART does.' },
      { t: 'type', q: 'Type the emergency stop G-code', a: ['M112'], e: 'M112 puts Klipper into shutdown immediately.' },
      { t: 'tf', q: 'RESTART also clears the MCU error state.', a: false, e: 'It doesn\'t. That is what FIRMWARE_RESTART is for.' },
      { t: 'match', q: 'Match the commands with their jobs', pairs: [['HELP', 'Lists commands'], ['STATUS', 'Reports host status'], ['M112', 'Emergency stop'], ['M115', 'Asks firmware version']], e: 'These basic commands come with every Klipper install.' },
      { t: 'order', q: 'You gave up while M109 was waiting to heat. Put the steps in order:', items: ['Send M112 (shutdown)', 'Reconnect the interface', 'Send FIRMWARE_RESTART', 'Start the new print'], e: 'That is the path in the Klipper FAQ: M112 → reconnect → FIRMWARE_RESTART.' },
      { t: 'tf', q: 'Klipper\'s long commands (like SET_SERVO) are not case sensitive; set_servo also works.', a: true, e: 'Correct. The docs write them in upper case but lower case runs the same command.' }
    ]
  }
  ]
},
{
  id: 'u2', title: 'Basic G-code', desc: 'Movement, coordinates, temperature and fans', color: '#3b82f6', icon: '🧭',
  lessons: [
  {
    id: 'u2l1', title: 'Movement commands', doc: 'G-Codes.html#g-code-commands',
    teach: [
      { title: 'G28 and G1', body: '• **G28**: homes the axes. G28 X homes only X.\n• **G1**: move. X Y Z position, E extrusion, F speed.\n• **G0** is the same as G1.\n\n⚠️ **F** is in **mm/minute**. F3000 = 50 mm/s.', code: 'G28\nG1 X100 Y100 Z10 F3000\nG4 P500   ; wait 500 ms' }
    ],
    questions: [
      { t: 'mc', q: 'Which command homes all axes?', o: ['G28', 'G1', 'G92', 'M84'], a: 0, e: 'G28 sends the axes to their home position.' },
      { t: 'fill', q: 'Move the head to X=50 Y=50', code: '___ X50 Y50 F6000', o: ['G1', 'G28', 'M104', 'G92'], a: 'G1', e: 'G1 (or G0) is the move command.' },
      { t: 'mc', q: 'What is the unit of F in a G1 command?', o: ['mm/minute', 'mm/second', 'steps/second', 'percent'], a: 0, e: 'In G-code F is always mm/min. Divide by 60 for mm/s.' },
      { t: 'mc', q: 'How many mm/s is F6000?', o: ['100 mm/s', '6000 mm/s', '60 mm/s', '10 mm/s'], a: 0, e: '6000 mm/min ÷ 60 = 100 mm/s.' },
      { t: 'tf', q: 'In Klipper G0 and G1 behave the same.', a: true, e: 'Yes, in Klipper G0 is an alias of G1.' },
      { t: 'mc', q: 'What does "G4 P2000" do?', o: ['Waits 2000 milliseconds (2 s)', 'Moves 2000 mm', 'Sets fan to 20%', 'Sets nozzle to 200 °C'], a: 0, e: 'G4 is dwell; P is in milliseconds.' },
      { t: 'type', q: 'Type the command that homes only the Y axis', a: ['G28 Y'], e: 'Add the axis letter after G28 to home only that axis.' },
      { t: 'tf', q: 'After the motors are disabled with M84, the printer must be homed again before moving.', a: true, e: 'Yes. Once the motors are released the position is lost; the FAQ says to home again.' }
    ]
  },
  {
    id: 'u2l2', title: 'Coordinate modes', doc: 'G-Codes.html#g-code-commands',
    teach: [
      { title: 'Absolute and relative', body: '• **G90**: absolute. G1 X10 = "go to X=10".\n• **G91**: relative. G1 X10 = "move 10 mm from here".\n\nFor the extruder:\n• **M83**: forces E to relative (even in G90).\n• **M82**: removes that forcing (it does not force E to absolute).', code: 'G91        ; relative\nG1 Z5 F600 ; 5 mm up\nG90        ; back to absolute' },
      { title: 'G92 and M114', body: '• **G92**: declares the current position as a value. Mostly G92 E0 to reset the extruder.\n• **M114**: shows the current position.\n• **M400**: waits for queued moves to finish.' }
    ],
    questions: [
      { t: 'mc', q: 'You want to lift the head 10 mm from where it is. Which mode?', o: ['G91 (relative)', 'G90 (absolute)', 'M82', 'G92'], a: 0, e: 'In relative mode G1 Z10 means "10 mm higher".' },
      { t: 'order', q: 'Lift the head 5 mm and go back to absolute mode', items: ['G91', 'G1 Z5 F600', 'G90'], e: 'Switch to relative, move, return to absolute.' },
      { t: 'mc', q: 'What does G92 E0 do?', o: ['Declares the extruder position as 0', 'Sets the extruder to 0 °C', 'Retracts filament', 'Turns off the extruder'], a: 0, e: 'G92 sets the current position to the given value. The filament does not move.' },
      { t: 'tf', q: 'M82 forces the extruder into absolute mode.', a: false, e: 'Per the docs, M82 only disables M83\'s forced-relative mode; it does not force E to absolute.' },
      { t: 'tf', q: 'After M83, extrusion (E) is relative even in G90 absolute mode.', a: true, e: 'Yes, M83 forces E to relative.' },
      { t: 'match', q: 'Match the commands', pairs: [['G90', 'Absolute coordinates'], ['G91', 'Relative coordinates'], ['M114', 'Show current position'], ['M400', 'Wait for moves to finish']], e: 'These four show up in macros all the time.' },
      { t: 'fill', q: 'Reset the extruder position', code: 'G92 ___', o: ['E0', 'X0', 'Z0', 'S0'], a: 'E0', e: 'G92 E0 resets the extruder counter.' }
    ]
  },
  {
    id: 'u2l3', title: 'Temperature and fans', doc: 'G-Codes.html#g-code-commands',
    teach: [
      { title: 'Heating commands', body: '• **M104 S200**: set nozzle to 200 °C and continue **without waiting**.\n• **M109 S200**: set nozzle to 200 °C and **wait**.\n• **M140 S60**: set bed to 60 °C, don\'t wait.\n• **M190 S60**: set bed to 60 °C and wait.\n• **M105**: report temperatures.', code: 'M140 S60\nM104 S200\nM190 S60\nM109 S200' },
      { title: 'Fans and motors', body: '• **M106 S255**: part fan full power (0-255).\n• **M107**: fan off.\n• **M84** or **M18**: release the motors.\n• **M220 S80**: speed 80%.\n• **M221 S105**: extrusion 105%.' }
    ],
    questions: [
      { t: 'mc', q: 'Which command heats the nozzle to 210 °C and waits until it gets there?', o: ['M109 S210', 'M104 S210', 'M190 S210', 'M140 S210'], a: 0, e: 'M109 heats and waits. M104 doesn\'t wait.' },
      { t: 'mc', q: 'Which command heats the bed WITHOUT waiting?', o: ['M140', 'M190', 'M109', 'M106'], a: 0, e: 'M140 sets the bed and continues; M190 waits.' },
      { t: 'match', q: 'Match the commands', pairs: [['M104', 'Nozzle, no wait'], ['M109', 'Nozzle, wait'], ['M140', 'Bed, no wait'], ['M190', 'Bed, wait']], e: 'Rule: 104/140 don\'t wait, 109/190 do.' },
      { t: 'mc', q: 'How do you run the part fan at half power?', o: ['M106 S127', 'M106 S50', 'M107 S50', 'M106 S0.5'], a: 0, e: 'M106 S is 0-255; half is about 127.' },
      { t: 'type', q: 'Type the command that turns off the part fan', a: ['M107', 'M106 S0'], e: 'M107 turns the fan off (M106 S0 also works).' },
      { t: 'order', q: 'A typical start heating order: start the bed, then the nozzle, then wait for both', items: ['M140 S60', 'M104 S200', 'M190 S60', 'M109 S200'], e: 'Starting both with non-waiting commands and then waiting saves time.' },
      { t: 'tf', q: 'M220 S50 lowers print speed to 50%.', a: true, e: 'M220 sets the speed factor as a percentage.' },
      { t: 'mc', q: 'Which Klipper command turns off all heaters at once?', o: ['TURN_OFF_HEATERS', 'M84', 'HEATERS_OFF', 'M112'], a: 0, e: 'TURN_OFF_HEATERS turns off all heaters. M112 stops too, but it is an emergency stop.' }
    ]
  }
  ]
},
{
  id: 'u3', title: 'Klipper Commands', desc: 'Extended commands, offsets, queries', color: '#a855f7', icon: '⌨️',
  lessons: [
  {
    id: 'u3l1', title: 'Syntax and heaters', doc: 'G-Codes.html#additional-commands',
    teach: [
      { title: 'COMMAND PARAMETER=value', body: 'Klipper\'s own commands have readable names. Parameters are written as **NAME=value**.', code: 'SET_HEATER_TEMPERATURE HEATER=extruder TARGET=200\nTEMPERATURE_WAIT SENSOR=extruder MINIMUM=195' },
      { title: 'Heater commands', body: '• **SET_HEATER_TEMPERATURE HEATER=… TARGET=…**: sets a target. Without TARGET it becomes 0 (off).\n• **TEMPERATURE_WAIT SENSOR=… MINIMUM=… MAXIMUM=…**: waits until the sensor is in range.\n• **TURN_OFF_HEATERS**: turns them all off.' }
    ],
    questions: [
      { t: 'fill', q: 'Set the bed to 60 °C', code: 'SET_HEATER_TEMPERATURE HEATER=heater_bed ___=60', o: ['TARGET', 'TEMP', 'S', 'VALUE'], a: 'TARGET', e: 'SET_HEATER_TEMPERATURE takes the target as TARGET.' },
      { t: 'mc', q: 'What does "SET_HEATER_TEMPERATURE HEATER=extruder" (no TARGET) do?', o: ['Turns the heater off (target 0)', 'Errors out', 'Heats to the last temperature', 'Sets 200 °C'], a: 0, e: 'Per the docs, without TARGET the target is 0.' },
      { t: 'mc', q: 'Which waits until the nozzle is at least 190 °C?', o: ['TEMPERATURE_WAIT SENSOR=extruder MINIMUM=190', 'M104 S190', 'WAIT_TEMP extruder 190', 'SET_HEATER_TEMPERATURE HEATER=extruder MINIMUM=190'], a: 0, e: 'TEMPERATURE_WAIT waits until the sensor reaches MINIMUM. Unlike M109 it doesn\'t wait to fully settle.' },
      { t: 'tf', q: 'Klipper command parameters are written as "NAME=value".', a: true, e: 'Yes, e.g. SET_SERVO SERVO=my_servo ANGLE=5.3' },
      { t: 'type', q: 'Type the Klipper command that turns off all heaters', a: ['TURN_OFF_HEATERS'], e: 'TURN_OFF_HEATERS. A good habit for end G-code.' },
      { t: 'mc', q: 'Where do you find the parameters and description of a Klipper command?', o: ['klipper3d.org → G-Codes page', 'Marlin docs', 'Cura settings', 'End of printer.cfg'], a: 0, e: 'All commands are on the G-Codes page, grouped by module.' }
    ]
  },
  {
    id: 'u3l2', title: 'Velocity limits and G-code offset', doc: 'G-Codes.html#set_gcode_offset',
    teach: [
      { title: 'SET_VELOCITY_LIMIT', body: 'Changes the config\'s speed/accel limits at run time. After a restart they go back to the config values.', code: 'SET_VELOCITY_LIMIT VELOCITY=200 ACCEL=2000\nSET_VELOCITY_LIMIT SQUARE_CORNER_VELOCITY=1' },
      { title: 'SET_GCODE_OFFSET', body: 'Adds an offset to future moves. Mostly used to fine-tune Z during a print (babystepping).\n\n• **Z=0.1**: sets total offset to 0.1.\n• **Z_ADJUST=0.05**: adds 0.05 to the current offset.\n• **MOVE=1**: applies it immediately with a move.', code: 'SET_GCODE_OFFSET Z=-0.2\nSET_GCODE_OFFSET Z_ADJUST=0.3   ; total = 0.1' }
    ],
    questions: [
      { t: 'mc', q: '"SET_GCODE_OFFSET Z=-0.2" then "SET_GCODE_OFFSET Z_ADJUST=0.3". What is the total Z offset?', o: ['0.1', '0.3', '-0.2', '0.5'], a: 0, e: 'Z_ADJUST adds to the current value: -0.2 + 0.3 = 0.1. This example is straight from the docs.' },
      { t: 'mc', q: 'The first layer is too squished mid-print. To raise the nozzle a bit?', o: ['SET_GCODE_OFFSET Z_ADJUST=0.02', 'SET_GCODE_OFFSET Z_ADJUST=-0.02', 'G92 Z0.02', 'G28 Z'], a: 0, e: 'A positive Z offset raises the nozzle.' },
      { t: 'tf', q: 'Changes made with SET_VELOCITY_LIMIT are written permanently to the config file.', a: false, e: 'No, they apply at run time. Edit [printer] to make them permanent.' },
      { t: 'fill', q: 'Set max acceleration to 1500', code: 'SET_VELOCITY_LIMIT ___=1500', o: ['ACCEL', 'VELOCITY', 'MAX_ACCEL', 'A'], a: 'ACCEL', e: 'SET_VELOCITY_LIMIT parameters: VELOCITY, ACCEL, MINIMUM_CRUISE_RATIO, SQUARE_CORNER_VELOCITY.' },
      { t: 'mc', q: 'What does MOVE=1 do in SET_GCODE_OFFSET?', o: ['Applies the offset right away with a move', 'Saves the offset permanently', 'Homes the head', 'Resets the offset'], a: 0, e: 'Without MOVE=1 the offset applies on the next absolute move of that axis.' },
      { t: 'mc', q: 'To make the babystep Z offset permanent in the probe settings?', o: ['Z_OFFSET_APPLY_PROBE + SAVE_CONFIG', 'SET_GCODE_OFFSET SAVE=1', 'G92 Z0', 'RESTART'], a: 0, e: 'Z_OFFSET_APPLY_PROBE writes babystepping into the probe z_offset; SAVE_CONFIG makes it permanent. With an endstop, Z_OFFSET_APPLY_ENDSTOP.' }
    ]
  },
  {
    id: 'u3l3', title: 'Query and status commands', doc: 'G-Codes.html#query_endstops',
    teach: [
      { title: 'Queries', body: '• **QUERY_ENDSTOPS**: are the endstops "triggered" or "open"?\n• **GET_POSITION**: detailed toolhead position.\n• **QUERY_PROBE**: is the probe triggered?\n• **M119** works too, but QUERY_ENDSTOPS is recommended.' },
      { title: 'Save/restore state', body: 'In macros, to avoid messing up G90/G91, M83, speed etc.:', code: 'SAVE_GCODE_STATE NAME=my_state\nG91\nG1 Z10 F300\nRESTORE_GCODE_STATE NAME=my_state' }
    ],
    questions: [
      { t: 'mc', q: 'You plugged in an endstop and want to see if it works. Which command?', o: ['QUERY_ENDSTOPS', 'GET_POSITION', 'STATUS', 'G28'], a: 0, e: 'QUERY_ENDSTOPS prints "triggered" or "open" for each endstop. Press it by hand and query again.' },
      { t: 'tf', q: 'Klipper supports M119, but the docs recommend QUERY_ENDSTOPS instead.', a: true, e: 'Correct.' },
      { t: 'order', q: 'In a macro, move up 10 mm without breaking the state', items: ['SAVE_GCODE_STATE NAME=s', 'G91', 'G1 Z10 F300', 'RESTORE_GCODE_STATE NAME=s'], e: 'Save state, go relative, move, restore.' },
      { t: 'mc', q: 'What does SAVE_GCODE_STATE NOT save?', o: ['Nozzle temperature', 'G90/G91 mode', 'M220 speed factor', 'SET_GCODE_OFFSET offset'], a: 0, e: 'It saves the G-code parsing state (modes, offsets, factors, position). Temperature is not part of it.' },
      { t: 'type', q: 'Type the Klipper command that shows the detailed toolhead position', a: ['GET_POSITION'], e: 'GET_POSITION; the standard equivalent is M114.' },
      { t: 'mc', q: 'What does QUERY_PROBE return?', o: ['"triggered" or "open"', 'Z height', 'Probe temperature', 'Mesh map'], a: 0, e: 'It reports the probe\'s current state.' }
    ]
  }
  ]
},
{
  id: 'u4', title: 'Motors and Axes', desc: '[printer], [stepper], rotation_distance', color: '#f97316', icon: '⚙️',
  lessons: [
  {
    id: 'u4l1', title: 'The [printer] section', doc: 'Config_Reference.html#printer',
    teach: [
      { title: 'Required options', body: '**kinematics**, **max_velocity** and **max_accel** are required.\n\nkinematics examples: cartesian, corexy, delta, corexz, polar, none.', code: '[printer]\nkinematics: corexy\nmax_velocity: 300   # mm/s\nmax_accel: 3000     # mm/s²\nmax_z_velocity: 15' },
      { title: 'Corners and short moves', body: '• **square_corner_velocity** (default 5 mm/s): speed through a 90° corner.\n• **minimum_cruise_ratio** (default 0.5): limits the top speed of short zig-zag moves. It replaced the old **max_accel_to_decel**.' }
    ],
    questions: [
      { t: 'mc', q: 'On printers like the Voron 2.4, X/Y motion is made by two motors together. What is the kinematics?', o: ['corexy', 'cartesian', 'delta', 'polar'], a: 0, e: 'In CoreXY two motors drive both X and Y through the belts.' },
      { t: 'mc', q: 'Which is NOT required in [printer]?', o: ['square_corner_velocity', 'kinematics', 'max_velocity', 'max_accel'], a: 0, e: 'square_corner_velocity is optional; default 5 mm/s.' },
      { t: 'mc', q: 'What is the default square_corner_velocity?', o: ['5 mm/s', '0', '50 mm/s', '1 mm/s'], a: 0, e: 'Default is 5 mm/s.' },
      { t: 'tf', q: 'minimum_cruise_ratio replaced the old max_accel_to_decel setting.', a: true, e: 'It is in the Klipper 0.13.0 release notes.' },
      { t: 'mc', q: 'What is the unit of max_accel?', o: ['mm/s²', 'mm/s', 'mm/min', 'steps/s'], a: 0, e: 'Acceleration is in mm/s².' },
      { t: 'fill', q: 'Define a cartesian printer', code: '[printer]\nkinematics: ___', o: ['cartesian', 'corexy', 'linear', 'xyz'], a: 'cartesian', e: 'Classic printers like the Ender 3 are cartesian.' },
      { t: 'tf', q: 'max_velocity can be changed during a print with SET_VELOCITY_LIMIT.', a: true, e: 'Yes, the docs say so explicitly.' }
    ]
  },
  {
    id: 'u4l2', title: '[stepper] and pins', doc: 'Config_Reference.html#stepper',
    teach: [
      { title: 'A stepper section', body: 'Each axis has a stepper section:', code: '[stepper_x]\nstep_pin: PB13\ndir_pin: !PB12\nenable_pin: !PB14\nmicrosteps: 16\nrotation_distance: 40\nendstop_pin: ^PC0\nposition_endstop: 0\nposition_max: 235\nhoming_speed: 50' },
      { title: 'Pin prefixes', body: '• **!** → reverse polarity (e.g. on dir_pin it flips direction)\n• **^** → enable pull-up (on endstops)\n• **~** → enable pull-down (on boards that support it)\n\nPin names are the board\'s hardware names: PA4, PB13 etc.' }
    ],
    questions: [
      { t: 'mc', q: 'The X motor moves the wrong way. Easiest fix?', o: ['Add/remove ! on dir_pin', 'Change step_pin', 'Set microsteps to 32', 'You have to rewire'], a: 0, e: 'Adding ! to dir_pin reverses the direction.' },
      { t: 'match', q: 'Match the pin prefixes', pairs: [['!', 'Reverse polarity'], ['^', 'Enable pull-up'], ['~', 'Enable pull-down']], e: 'Prefixes can be combined, e.g. ^!PC0.' },
      { t: 'mc', q: 'On a cartesian printer, which is required for stepper_x?', o: ['position_max', 'homing_speed', 'position_min', 'second_homing_speed'], a: 0, e: 'On cartesian X/Y/Z, endstop_pin, position_endstop and position_max are required.' },
      { t: 'mc', q: 'Default homing_speed?', o: ['5 mm/s', '50 mm/s', '20 mm/s', '100 mm/s'], a: 0, e: 'Default 5 mm/s; most people set it higher.' },
      { t: 'tf', q: 'The default position_min is 0 mm.', a: true, e: 'Yes.' },
      { t: 'fill', q: 'Add a pull-up to the endstop pin', code: 'endstop_pin: ___PC0', o: ['^', '!', '~', '#'], a: '^', e: '^ enables the pull-up; common on mechanical endstops.' },
      { t: 'mc', q: 'What happens with homing_retract_dist: 0?', o: ['No second (slow) homing', 'Homing is cancelled', 'Axis homes reversed', 'Error'], a: 0, e: 'By default it backs off 5 mm and homes a second time; 0 disables the second home.' }
    ]
  },
  {
    id: 'u4l3', title: 'rotation_distance', doc: 'Rotation_Distance.html',
    teach: [
      { title: 'What is it?', body: 'How many mm the axis travels for **one full turn** of the motor.\n\n**Belt axis:** belt pitch × pulley teeth\nExample: 2 mm (GT2) × 20 teeth = **40**\n\n**If you know steps_per_mm:**\nrotation_distance = full_steps × microsteps ÷ steps_per_mm\nExample: 200 × 16 ÷ 80 = **40**' },
      { title: 'Extruder: measure and trim', body: '1. Mark the filament ~70 mm from the extruder and measure.\n2. **G91** then **G1 E50 F60** (slowly!).\n3. Measure again; actual = first − second measurement.\n4. new = old × actual ÷ 50\n\n⚠️ Not for X/Y/Z — extruder only.' }
    ],
    questions: [
      { t: 'mc', q: 'GT2 belt (2 mm pitch) and a 20-tooth pulley. rotation_distance?', o: ['40', '20', '80', '10'], a: 0, e: '2 × 20 = 40.' },
      { t: 'mc', q: 'GT2 belt and a 16-tooth pulley. rotation_distance?', o: ['32', '16', '40', '8'], a: 0, e: '2 × 16 = 32.' },
      { t: 'mc', q: 'Marlin steps_per_mm = 80, microsteps = 16, 1.8° motor. rotation_distance?', o: ['40', '80', '20', '16'], a: 0, e: '200 × 16 ÷ 80 = 40. (1.8° motor = 200 full steps)' },
      { t: 'mc', q: 'Extruder rotation_distance is 22; you asked for 50 mm, got 48 mm. New value?', o: ['21.12', '22.92', '24', '20'], a: 0, e: '22 × 48 ÷ 50 = 21.12. Under-extruding means a smaller value (the motor turns more).' },
      { t: 'tf', q: 'The "measure and trim" method is also recommended for X and Y.', a: false, e: 'No. The docs say explicitly not to; X/Y/Z are calculated from the hardware.' },
      { t: 'mc', q: 'Why use a SLOW extrusion like G1 E50 F60 for the extruder test?', o: ['Fast extrusion builds pressure and skews the result', 'So the motor doesn\'t burn', 'So the filament doesn\'t snap', 'It doesn\'t matter'], a: 0, e: 'Fast extrusion builds pressure in the nozzle and skews the measurement. Don\'t use the UI "extrude" button either.' },
      { t: 'mc', q: 'Full steps per rotation of a 0.9° motor?', o: ['400', '200', '360', '800'], a: 0, e: '360 ÷ 0.9 = 400. In config: full_steps_per_rotation: 400.' },
      { t: 'tf', q: 'rotation_distance for X/Y/Z usually comes out as a whole number.', a: true, e: 'Docs: if within .01 of a whole number, round to it.' }
    ]
  }
  ]
},
{
  id: 'u5', title: 'Hotend, Bed, Safety', desc: '[extruder], PID, verify_heater', color: '#ef4444', icon: '🔥',
  lessons: [
  {
    id: 'u5l1', title: 'The [extruder] section', doc: 'Config_Reference.html#extruder',
    teach: [
      { title: 'Motor + heater together', body: '[extruder] defines both the extruder motor and the hotend heater.', code: '[extruder]\nstep_pin: PB3\ndir_pin: !PB4\nenable_pin: !PD1\nmicrosteps: 16\nrotation_distance: 22.67\nnozzle_diameter: 0.400\nfilament_diameter: 1.750\nheater_pin: PC8\nsensor_type: EPCOS 100K B57560G104F\nsensor_pin: PA0\ncontrol: pid\npid_Kp: 21.5\npid_Ki: 1.06\npid_Kd: 108.6\nmin_temp: 0\nmax_temp: 260' },
      { title: 'Protection settings', body: '• **min_extrude_temp** (default 170 °C): below this the extruder won\'t move → "Extrude below minimum temp".\n• **max_extrude_only_distance** (default 50 mm): a longer single extrude/retract errors out.\n• **min_temp / max_temp**: if the measured temperature leaves this range the MCU shuts down.' }
    ],
    questions: [
      { t: 'mc', q: 'Which is required in [extruder]?', o: ['nozzle_diameter', 'pressure_advance', 'max_power', 'smooth_time'], a: 0, e: 'nozzle_diameter and filament_diameter are required.' },
      { t: 'mc', q: 'You pushed filament with a cold nozzle and got "Extrude below minimum temp". Default limit?', o: ['170 °C', '150 °C', '200 °C', '180 °C'], a: 0, e: 'min_extrude_temp defaults to 170 °C.' },
      { t: 'mc', q: 'Which values can the control option take?', o: ['pid or watermark', 'pid or bang', 'auto or manual', 'pwm or on/off'], a: 0, e: 'Per the docs, the control algorithm is pid or watermark.' },
      { t: 'tf', q: 'If the sensor goes outside min_temp/max_temp, the MCU puts itself into shutdown.', a: true, e: 'Yes, it is a safety feature in the MCU.' },
      { t: 'mc', q: 'You loaded 100 mm of filament with a single G1 E100 and got an error. Why?', o: ['max_extrude_only_distance defaults to 50 mm', 'min_extrude_temp is low', 'No F value', 'No G92 E0'], a: 0, e: 'A single extrude move can\'t exceed 50 mm; split it or raise the setting.' },
      { t: 'fill', q: 'Define 1.75 mm filament', code: 'filament_diameter: ___', o: ['1.750', '0.400', '2.85', '175'], a: '1.750', e: 'filament_diameter is the filament size; 0.4 would be the nozzle.' },
      { t: 'tf', q: '[heater_bed] uses the same heater settings as [extruder] (heater_pin, sensor_type, control…).', a: true, e: 'The docs say heater_bed uses the same heater settings as extruder.' }
    ]
  },
  {
    id: 'u5l2', title: 'PID calibration', doc: 'G-Codes.html#pid_calibrate',
    teach: [
      { title: 'PID_CALIBRATE', body: 'The heater reaches the target, then cycles off and on a few times and calculates the best Kp/Ki/Kd. Send **SAVE_CONFIG** to store them.', code: 'PID_CALIBRATE HEATER=extruder TARGET=210\nSAVE_CONFIG\n\nPID_CALIBRATE HEATER=heater_bed TARGET=60\nSAVE_CONFIG' },
      { title: 'New (October 2026)', body: 'A bug in Klipper\'s PID_CALIBRATE math was fixed. It used to recommend values twice as large as intended. If you see heating oscillation, run PID_CALIBRATE again.' }
    ],
    questions: [
      { t: 'fill', q: 'Nozzle PID calibration', code: 'PID_CALIBRATE HEATER=___ TARGET=210', o: ['extruder', 'nozzle', 'hotend', 'E0'], a: 'extruder', e: 'HEATER is the config section name: extruder or heater_bed.' },
      { t: 'order', q: 'Calibrate the bed PID and save', items: ['PID_CALIBRATE HEATER=heater_bed TARGET=60', 'Wait for the test to finish', 'SAVE_CONFIG'], e: 'SAVE_CONFIG writes the new Kp/Ki/Kd and restarts Klipper.' },
      { t: 'tf', q: 'PID_CALIBRATE results are saved permanently even without SAVE_CONFIG.', a: false, e: 'No, SAVE_CONFIG is required.' },
      { t: 'mc', q: 'What does WRITE_FILE=1 do in PID_CALIBRATE?', o: ['Writes temperature samples to /tmp/heattest.txt', 'Writes the result to printer.cfg', 'Repeats the test', 'Draws a graph'], a: 0, e: 'It logs every temperature sample taken during the test.' },
      { t: 'mc', q: 'Per the October 2026 Klipper change, what did the old PID_CALIBRATE do?', o: ['Recommended values twice as large as intended', 'Didn\'t work at all', 'Didn\'t support the bed', 'Only suggested watermark'], a: 0, e: 'Config_Changes 20261018: the math bug was fixed; values used to come out doubled.' },
      { t: 'tf', q: 'It makes sense to run PID calibration with a TARGET close to your printing temperature.', a: true, e: 'Yes: around 200-210 for PLA, 60 for the bed.' }
    ]
  },
  {
    id: 'u5l3', title: 'Heater safety', doc: 'Config_Reference.html#verify_heater',
    teach: [
      { title: 'verify_heater', body: 'It is **enabled automatically** for every heater. If a heater can\'t heat (sensor fell out, weak cartridge) it raises an error → "Heater extruder not heating at expected rate".\n\n• **check_gain_time**: during heat-up it expects at least **heating_gain** (2 °C) rise within this time. Default: extruder 20 s, bed 60 s.\n• **max_error** (120): accumulated error limit.' },
      { title: 'idle_timeout', body: 'If the printer sits idle for a while it turns off heaters and motors.\n\nDefault: **600 seconds**, running **TURN_OFF_HEATERS** and **M84**.', code: '[idle_timeout]\ntimeout: 1800' }
    ],
    questions: [
      { t: 'tf', q: 'To use verify_heater protection you must add a [verify_heater] section.', a: false, e: 'No, it is on for every heater automatically. Add the section only to change defaults.' },
      { t: 'mc', q: 'Default check_gain_time for the extruder, in seconds?', o: ['20', '60', '120', '5'], a: 0, e: 'Extruder 20 s, bed 60 s.' },
      { t: 'mc', q: 'A large, slow-heating bed keeps throwing "not heating at expected rate". Which setting?', o: ['Increase check_gain_time in [verify_heater heater_bed]', 'Lower max_temp', 'Zero pid_Kp', 'Raise min_extrude_temp'], a: 0, e: 'A larger check_gain_time gives the heater more time. But check wiring/sensor first!' },
      { t: 'mc', q: 'Default idle_timeout?', o: ['600 seconds (10 min)', '60 seconds', '1 hour', 'Off'], a: 0, e: 'Default 600 seconds.' },
      { t: 'match', q: 'Match', pairs: [['idle_timeout', 'Turns things off when idle'], ['verify_heater', 'Catches a heater not heating'], ['min_temp/max_temp', 'Sensor limit, MCU shuts down'], ['min_extrude_temp', 'Prevents cold extrusion']], e: 'These are Klipper\'s basic safety layers.' },
      { t: 'type', q: 'Type the command that sets the idle timeout to 30 minutes (1800 s)', a: ['SET_IDLE_TIMEOUT TIMEOUT=1800'], e: 'SET_IDLE_TIMEOUT TIMEOUT=1800. For permanent: [idle_timeout] timeout: 1800.' }
    ]
  }
  ]
}
);
