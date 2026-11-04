// Klipper Learn — lesson content in English (Units 6-9).
window.KLIPPER_UNITS_EN = window.KLIPPER_UNITS_EN || [];
window.KLIPPER_UNITS_EN.push(
{
  id: 'u6', title: 'Probing and Leveling', desc: 'Probe, bed mesh, tilt adjustment', color: '#14b8a6', icon: '📐',
  lessons: [
  {
    id: 'u6l1', title: 'Probe setup', doc: 'Probe_Calibrate.html',
    teach: [
      { title: '[probe] and the virtual endstop', body: 'To use the probe as the Z endstop, set **endstop_pin: probe:z_virtual_endstop** in stepper_z. Then **do not set position_endstop** in stepper_z.\n\nAdd **[safe_z_home]** to home Z in the middle of the bed.', code: '[probe]\npin: ^PC14\nx_offset: -40\ny_offset: -10\nz_offset: 1.2\n\n[stepper_z]\nendstop_pin: probe:z_virtual_endstop\n\n[safe_z_home]\nhome_xy_position: 117, 117\nz_hop: 10' },
      { title: 'z_offset calibration', body: '**PROBE_CALIBRATE** starts the paper test tool:\n• **TESTZ Z=-0.1** → 0.1 mm down\n• **TESTZ Z=+** / **TESTZ Z=-** → bisect relative to previous attempts\n• When the paper drags slightly: **ACCEPT**, then **SAVE_CONFIG**.\nTo give up: **ABORT**.' }
    ],
    questions: [
      { t: 'fill', q: 'Use the probe as the Z endstop', code: '[stepper_z]\nendstop_pin: ___', o: ['probe:z_virtual_endstop', 'probe:z_endstop', '^PC14', 'virtual_z'], a: 'probe:z_virtual_endstop', e: 'The [probe] section creates a virtual pin called probe:z_virtual_endstop.' },
      { t: 'tf', q: 'When using probe:z_virtual_endstop, position_endstop must also be set in stepper_z.', a: false, e: 'No. Per the docs, don\'t set position_endstop then; z_offset is used.' },
      { t: 'order', q: 'Probe z_offset calibration order', items: ['G28', 'PROBE_CALIBRATE', 'Go down with TESTZ to the paper test', 'ACCEPT', 'SAVE_CONFIG'], e: 'Home → calibration tool → fine tune → accept → save.' },
      { t: 'mc', q: 'During the paper test the nozzle is too low. To go up 0.05 mm?', o: ['TESTZ Z=0.05', 'TESTZ Z=-0.05', 'G1 Z0.05', 'SET_GCODE_OFFSET Z=0.05'], a: 0, e: 'Positive TESTZ goes up, negative goes down.' },
      { t: 'mc', q: 'How many samples does PROBE_ACCURACY take by default?', o: ['10', '3', '5', '25'], a: 0, e: 'Default 10; it reports max, min, average, median and standard deviation.' },
      { t: 'mc', q: 'What is [safe_z_home] for?', o: ['Homes Z at a given X,Y (usually bed center)', 'Never homes Z', 'Homes Z to max', 'Disables the probe'], a: 0, e: 'So the probe isn\'t off the bed, home_xy_position sets where Z homes.' },
      { t: 'mc', q: 'To give up during the paper test?', o: ['ABORT', 'CANCEL', 'M112', 'RESTART'], a: 0, e: 'ABORT ends the manual probe tool, ACCEPT accepts.' },
      { t: 'tf', q: 'x_offset and y_offset are the distance between the probe and the nozzle.', a: true, e: 'Yes, in mm; defaults are 0.' }
    ]
  },
  {
    id: 'u6l2', title: 'Bed mesh', doc: 'Bed_Mesh.html',
    teach: [
      { title: 'Height map', body: 'Probes many points on the bed and corrects Z automatically during the print.', code: '[bed_mesh]\nspeed: 120\nhorizontal_move_z: 5\nmesh_min: 10, 10\nmesh_max: 220, 220\nprobe_count: 5, 5' },
      { title: 'Commands', body: '• **BED_MESH_CALIBRATE**: probes and the mesh is **active immediately**. Without PROFILE it saves to "default".\n• **ADAPTIVE=1**: only probes the print area.\n• **BED_MESH_PROFILE SAVE=/LOAD=/REMOVE=**: profile management (SAVE_CONFIG to persist).\n• **BED_MESH_CLEAR**: turns the mesh off; recommended in end G-code.' }
    ],
    questions: [
      { t: 'mc', q: 'When is the mesh active after BED_MESH_CALIBRATE?', o: ['Immediately', 'After SAVE_CONFIG', 'On the next print', 'After BED_MESH_PROFILE LOAD'], a: 0, e: 'Per the docs, the mesh is active as soon as it completes.' },
      { t: 'mc', q: 'Without a PROFILE parameter, which profile is the mesh saved to?', o: ['default', 'mesh1', 'auto', 'Not saved'], a: 0, e: 'The "default" profile.' },
      { t: 'fill', q: 'Mesh only the print area', code: 'BED_MESH_CALIBRATE ___=1', o: ['ADAPTIVE', 'SMART', 'AREA', 'FAST'], a: 'ADAPTIVE', e: 'ADAPTIVE=1 shrinks the probed area to the objects being printed (added in Klipper 0.13).' },
      { t: 'tf', q: 'After BED_MESH_PROFILE SAVE=pei, without SAVE_CONFIG the profile is lost on restart.', a: true, e: 'After SAVE and REMOVE, SAVE_CONFIG is needed to make it permanent.' },
      { t: 'mc', q: 'Which mesh command do the docs recommend in end G-code?', o: ['BED_MESH_CLEAR', 'BED_MESH_CALIBRATE', 'BED_MESH_OUTPUT', 'BED_MESH_MAP'], a: 0, e: 'BED_MESH_CLEAR clears the mesh and removes Z adjustment.' },
      { t: 'mc', q: 'How many points does probe_count: 5, 5 probe?', o: ['25', '10', '5', '50'], a: 0, e: '5 × 5 = 25 points.' },
      { t: 'tf', q: 'A profile created with ADAPTIVE=1 starts with adaptive- and should not be saved for reuse.', a: true, e: 'That is what the docs say; it is regenerated each print.' },
      { t: 'type', q: 'Type the command that loads the mesh profile "pei"', a: ['BED_MESH_PROFILE LOAD=pei'], e: 'BED_MESH_PROFILE LOAD=pei' }
    ]
  },
  {
    id: 'u6l3', title: 'Tilt, gantry and screws', doc: 'G-Codes.html#z_tilt',
    teach: [
      { title: 'Multiple Z motors', body: '• **Z_TILT_ADJUST**: aligns several independent Z motors with the probe (e.g. 2-3 Z motor printers).\n• **QUAD_GANTRY_LEVEL**: levels a 4-Z-motor gantry (like the Voron 2.4).\n\nBoth run after G28 and before the mesh.' },
      { title: 'Screw adjustment', body: '• **SCREWS_TILT_CALCULATE**: probes the screw points and tells how many turns to give each screw. **G28 first is mandatory!**\n• **BED_SCREWS_ADJUST**: paper-based screw adjustment without a probe.\n• **Z_ENDSTOP_CALIBRATE**: calibrates the position_endstop of a mechanical Z endstop.' }
    ],
    questions: [
      { t: 'mc', q: 'A Voron 2.4 style printer with 4 Z motors and a moving gantry. Which command?', o: ['QUAD_GANTRY_LEVEL', 'Z_TILT_ADJUST', 'BED_TILT_CALIBRATE', 'SCREWS_TILT_CALCULATE'], a: 0, e: 'QUAD_GANTRY_LEVEL probes the four corners and adjusts each Z motor separately.' },
      { t: 'mc', q: 'Which command tells you how many turns to give each bed screw?', o: ['SCREWS_TILT_CALCULATE', 'BED_MESH_CALIBRATE', 'Z_TILT_ADJUST', 'PROBE_ACCURACY'], a: 0, e: 'SCREWS_TILT_CALCULATE reports turns like "CW 00:15" (direction and minutes).' },
      { t: 'tf', q: 'G28 is mandatory before SCREWS_TILT_CALCULATE.', a: true, e: 'Docs: "You MUST always do a G28 before using this command."' },
      { t: 'order', q: 'Correct pre-print order on a dual-Z printer', items: ['G28', 'Z_TILT_ADJUST', 'G28 Z', 'BED_MESH_CALIBRATE'], e: 'Tilt adjust changes Z, so re-home Z, then take the mesh last.' },
      { t: 'mc', q: 'Which command finds a mechanical Z endstop\'s position_endstop with the paper test?', o: ['Z_ENDSTOP_CALIBRATE', 'PROBE_CALIBRATE', 'QUERY_ENDSTOPS', 'G92 Z0'], a: 0, e: 'Z_ENDSTOP_CALIBRATE uses the same TESTZ/ACCEPT tools as PROBE_CALIBRATE.' },
      { t: 'match', q: 'Match', pairs: [['Z_TILT_ADJUST', 'Aligns independent Z motors'], ['QUAD_GANTRY_LEVEL', '4-corner gantry'], ['BED_SCREWS_ADJUST', 'Screw adjust without probe'], ['SCREWS_TILT_CALCULATE', 'Screw turns from probe']], e: 'Which one you use depends on the printer\'s mechanics.' }
    ]
  }
  ]
},
{
  id: 'u7', title: 'Macros', desc: 'gcode_macro, Jinja2, variables', color: '#eab308', icon: '🧩',
  lessons: [
  {
    id: 'u7l1', title: 'First macro', doc: 'Command_Templates.html',
    teach: [
      { title: 'gcode_macro', body: 'You define your own command. The **gcode:** line starts at the beginning of the line, the lines under it **must be indented**.', code: '[gcode_macro PARK]\ndescription: Park the head at the back\ngcode:\n  G90\n  G1 X10 Y220 F6000' },
      { title: 'Naming rules', body: '• Case doesn\'t matter: PARK = park.\n• If the name has numbers, they must all be **at the end**: TEST_MACRO25 ✓, MACRO25_TEST3 ✗\n• **description:** shows in HELP. Default is "G-Code macro".\n\nTo call it, just type its name in the console: **PARK**' }
    ],
    questions: [
      { t: 'fill', q: 'Start a macro section', code: '[___ PARK]\ngcode:\n  G1 X10 Y220 F6000', o: ['gcode_macro', 'macro', 'gcode', 'script'], a: 'gcode_macro', e: 'Macros are defined with a [gcode_macro NAME] section.' },
      { t: 'tf', q: 'The lines under gcode: in a macro can start at the beginning of the line (no indent).', a: false, e: 'No. An unindented line is read as a new option. Macro lines must always be indented.' },
      { t: 'mc', q: 'Which macro name is INVALID?', o: ['MACRO25_TEST3', 'TEST_MACRO25', 'PARK', 'LOAD_FILAMENT'], a: 0, e: 'If there are numbers, they all must be at the end of the name.' },
      { t: 'mc', q: 'Which option adds a description to a macro?', o: ['description:', 'help:', 'info:', 'comment:'], a: 0, e: 'description: shows in HELP output and autocomplete.' },
      { t: 'tf', q: 'A macro defined as [gcode_macro park] also runs when you type PARK.', a: true, e: 'Macro names are case insensitive.' },
      { t: 'order', q: 'Build a correct macro', items: ['[gcode_macro WIPE]', 'description: Wipe the nozzle', 'gcode:', '  G1 X5 Y5 F6000', '  G1 X50 F6000'], e: 'Section name → options → gcode: → indented commands.' }
    ]
  },
  {
    id: 'u7l2', title: 'Jinja2 and parameters', doc: 'Command_Templates.html#template-expansion',
    teach: [
      { title: '{ } and {% %}', body: 'Macros are processed with the **Jinja2** template language:\n• **{ expression }** → writes the value\n• **{% statement %}** → control like if, for, set', code: '{% set wipe_count = 3 %}\n{% for i in range(wipe_count) %}\n  G1 X5 F6000\n  G1 X50 F6000\n{% endfor %}' },
      { title: 'params', body: 'Parameters passed to a macro are read through **params**:\n• Names are always **UPPER CASE**\n• Values always come as **strings**; use **|float** or **|int** for math\n• **|default(…)** gives a default', code: '[gcode_macro HEAT_BED]\ngcode:\n  {% set t = params.TEMP|default(60)|float %}\n  M190 S{t}' }
    ],
    questions: [
      { t: 'mc', q: 'Which brackets write a value into a macro?', o: ['{ }', '{% %}', '[ ]', '$( )'], a: 0, e: '{ } evaluates and writes the result; {% %} is for control statements.' },
      { t: 'mc', q: 'You called HEAT_BED temp=70. How do you read it in the macro?', o: ['params.TEMP', 'params.temp', 'param[0]', 'args.TEMP'], a: 0, e: 'Parameter names are always upper case inside a macro.' },
      { t: 'tf', q: 'Values from params are automatically converted to numbers.', a: false, e: 'No, they always come as strings. Use |float or |int for math.' },
      { t: 'fill', q: 'Use 200 if the parameter is missing and convert to a number', code: '{% set t = params.TEMP|___(200)|float %}', o: ['default', 'or', 'else', 'fallback'], a: 'default', e: '|default(200) uses 200 if no parameter is given.' },
      { t: 'mc', q: '"SET_PERCENT VALUE=.2" was called. What does "M117 { params.VALUE|float * 100 }%" produce?', o: ['M117 20.0%', 'M117 .2%', 'M117 VALUE%', 'An error'], a: 0, e: '0.2 × 100 = 20.0. This example is straight from the docs.' },
      { t: 'order', q: 'Build a simple if block', items: ['{% if params.TEMP|int > 250 %}', '  RESPOND MSG="Too hot!"', '{% else %}', '  M104 S{params.TEMP}', '{% endif %}'], e: 'In Jinja2 an if block closes with {% endif %}.' },
      { t: 'mc', q: 'Which variable reads the printer\'s current state (fan speed, temperature…) in a macro?', o: ['printer', 'status', 'klipper', 'machine'], a: 0, e: 'The printer variable, e.g. printer.fan.speed or printer.extruder.temperature.' }
    ]
  },
  {
    id: 'u7l3', title: 'Variables and advanced macros', doc: 'Command_Templates.html#variables',
    teach: [
      { title: 'variable_ and SET_GCODE_VARIABLE', body: 'The **variable_** prefix defines a (non-persistent) macro variable. Variable names can\'t contain upper case.', code: '[gcode_macro START]\nvariable_bed_temp: 60\ngcode:\n  M190 S{bed_temp}\n\n# Change at run time:\nSET_GCODE_VARIABLE MACRO=START VARIABLE=bed_temp VALUE=70' },
      { title: 'rename_existing and delayed_gcode', body: '• **rename_existing**: replaces a built-in command (e.g. M109) with your macro; call the original by the new name you give it.\n• **[delayed_gcode]** + **UPDATE_DELAYED_GCODE ID=… DURATION=…**: runs after a delay. DURATION=0 cancels.\n\n⚠️ A macro is evaluated **entirely** first, then its commands run. You can\'t read a change from printer inside the same macro.' }
    ],
    questions: [
      { t: 'fill', q: 'Add a variable to a macro', code: '[gcode_macro START]\n___fan: 255\ngcode:\n  M106 S{fan}', o: ['variable_', 'var_', 'set_', 'param_'], a: 'variable_', e: 'Defined with the variable_ prefix, used in the macro just by its name (fan).' },
      { t: 'mc', q: 'Which command changes a macro variable at run time?', o: ['SET_GCODE_VARIABLE', 'SAVE_VARIABLE', 'SET_VARIABLE', 'UPDATE_MACRO'], a: 0, e: 'SET_GCODE_VARIABLE MACRO=… VARIABLE=… VALUE=…; the value is parsed as a Python literal.' },
      { t: 'tf', q: 'variable_BedTemp is a valid variable name.', a: false, e: 'Variable names can\'t contain upper case: it should be variable_bed_temp.' },
      { t: 'mc', q: 'For a variable that keeps its value across restarts?', o: ['[save_variables] + SAVE_VARIABLE', 'variable_', 'SET_GCODE_VARIABLE', 'params'], a: 0, e: 'SAVE_VARIABLE writes to disk; variable_ values reset to the config value on restart.' },
      { t: 'mc', q: 'To cancel a pending delayed_gcode?', o: ['UPDATE_DELAYED_GCODE ID=name DURATION=0', 'CANCEL_DELAYED_GCODE', 'DELAYED_GCODE STOP=1', 'M112'], a: 0, e: 'DURATION=0 cancels the pending timer.' },
      { t: 'mc', q: 'Which option replaces a built-in G-code with your macro and keeps the original under a new name?', o: ['rename_existing', 'override:', 'replace_gcode', 'alias:'], a: 0, e: 'rename_existing: e.g. M109.1; your macro calls the original by that name. Use with care.' },
      { t: 'tf', q: 'A macro is evaluated from start to end first, and the resulting commands run afterwards.', a: true, e: 'So if a macro sends M104 and then reads printer.extruder.target, it won\'t see the new value.' },
      { t: 'mc', q: 'To print info as "// message" to the console from a macro?', o: ['{ action_respond_info("message") }', 'PRINT("message")', 'echo message', '{ log("message") }'], a: 0, e: 'action_respond_info prefixes each line with "// ". Alternative: add [respond] and use RESPOND MSG="…"' }
    ]
  }
  ]
},
{
  id: 'u8', title: 'Fine Tuning', desc: 'Pressure advance, input shaper, TMC', color: '#ec4899', icon: '🎯',
  lessons: [
  {
    id: 'u8l1', title: 'Pressure advance', doc: 'Pressure_Advance.html',
    teach: [
      { title: 'What does it do?', body: 'While the head accelerates it pushes a bit more filament, while decelerating it pulls the same amount back. It reduces bulging and gaps at corners.\n\nDefault is **0** (off).', code: 'SET_PRESSURE_ADVANCE ADVANCE=0.045' },
      { title: 'Finding it with a tuning tower', body: '1. Exaggerate corners:\n**SET_VELOCITY_LIMIT SQUARE_CORNER_VELOCITY=1 ACCEL=500**\n2. Direct drive:\n**TUNING_TOWER COMMAND=SET_PRESSURE_ADVANCE PARAMETER=ADVANCE START=0 FACTOR=.005**\nLong bowden: **FACTOR=.020**\n3. Print the tower, measure the height where corners look best.\n4. value = START + height × FACTOR' }
    ],
    questions: [
      { t: 'mc', q: 'Default pressure_advance value?', o: ['0 (off)', '0.05', '0.5', '1'], a: 0, e: 'Default 0, i.e. off.' },
      { t: 'mc', q: 'Which TUNING_TOWER FACTOR do the docs recommend for direct drive?', o: ['.005', '.020', '.1', '1'], a: 0, e: 'Direct drive .005, long bowden .020.' },
      { t: 'mc', q: 'Tower with FACTOR=.005, START=0; best corners at 9 mm height. pressure_advance?', o: ['0.045', '0.09', '0.0045', '0.9'], a: 0, e: '0 + 9 × 0.005 = 0.045.' },
      { t: 'fill', q: 'Set pressure advance', code: 'SET_PRESSURE_ADVANCE ___=0.04', o: ['ADVANCE', 'VALUE', 'PA', 'K'], a: 'ADVANCE', e: 'SET_PRESSURE_ADVANCE ADVANCE=… (the equivalent of Marlin\'s K factor).' },
      { t: 'tf', q: 'Setting SQUARE_CORNER_VELOCITY=1 before the test makes pressure effects at corners more visible.', a: true, e: 'Going slowly through corners makes the pressure effect stand out.' },
      { t: 'mc', q: 'Where do you put the value to make it permanent?', o: ['pressure_advance: in [extruder]', 'In [printer]', 'SAVE_CONFIG is enough', 'In the slicer'], a: 0, e: 'The TUNING_TOWER result isn\'t written by SAVE_CONFIG; add pressure_advance: 0.045 to [extruder] by hand.' },
      { t: 'tf', q: 'pressure_advance_smooth_time may not exceed 200 ms.', a: true, e: 'Yes; default 0.040 s (40 ms).' }
    ]
  },
  {
    id: 'u8l2', title: 'Input shaper', doc: 'Resonance_Compensation.html',
    teach: [
      { title: 'Goodbye ghosting', body: 'Input shaper suppresses the printer\'s resonance frequency and reduces the "ghosting/ringing" ripples.', code: '[input_shaper]\nshaper_freq_x: 48.6\nshaper_type_x: mzv\nshaper_freq_y: 39.2\nshaper_type_y: ei' },
      { title: 'Automatic with an accelerometer', body: 'Connect an accelerometer like the ADXL345:\n• **ACCELEROMETER_QUERY**: connection test\n• **TEST_RESONANCES AXIS=X**: measurement\n• **SHAPER_CALIBRATE**: measures and suggests the best shaper\n• Then **SAVE_CONFIG**\n\nShaper types: zv, mzv, zvd, ei, 2hump_ei, 3hump_ei. Default **mzv**.' }
    ],
    questions: [
      { t: 'mc', q: 'Which print defect does input shaper reduce?', o: ['Ghosting / ringing', 'Stringing', 'Warping', 'Under extrusion'], a: 0, e: 'It suppresses resonance ripples.' },
      { t: 'mc', q: 'Default shaper_type?', o: ['mzv', 'zv', 'ei', '2hump_ei'], a: 0, e: 'Default mzv (no parameters).' },
      { t: 'order', q: 'Input shaper tuning with an accelerometer', items: ['ACCELEROMETER_QUERY', 'G28', 'SHAPER_CALIBRATE', 'SAVE_CONFIG'], e: 'Check the accelerometer works, home, calibrate, save.' },
      { t: 'tf', q: 'shaper_freq_x: 0 disables input shaping on X.', a: true, e: 'Default is 0, meaning shaping is off.' },
      { t: 'mc', q: 'To quickly test an ADXL345 connection?', o: ['ACCELEROMETER_QUERY', 'SHAPER_CALIBRATE', 'QUERY_ADC', 'STATUS'], a: 0, e: 'One of the returned values should be close to gravity (~9800 mm/s²).' },
      { t: 'mc', q: 'Where does SHAPER_CALIBRATE write its measurement data?', o: ['/tmp/calibration_data_<axis>_<name>.csv', 'printer.cfg', 'klippy.log', 'SD card'], a: 0, e: 'CSV files go into /tmp; scripts/calibrate_shaper.py draws graphs.' },
      { t: 'match', q: 'Match', pairs: [['SHAPER_CALIBRATE', 'Measure and suggest shaper'], ['TEST_RESONANCES', 'Only measure resonance'], ['SET_INPUT_SHAPER', 'Change at run time'], ['[input_shaper]', 'Permanent setting']], e: 'After SHAPER_CALIBRATE, SAVE_CONFIG writes it to the config.' }
    ]
  },
  {
    id: 'u8l3', title: 'TMC drivers', doc: 'TMC_Drivers.html',
    teach: [
      { title: 'Driver setup over UART', body: 'Set current and mode of drivers like the TMC2209 from config. The section name is **tmc2209 + stepper name**:', code: '[tmc2209 stepper_x]\nuart_pin: PC11\nrun_current: 0.580\nstealthchop_threshold: 999999' },
      { title: 'Sensorless homing', body: 'Uses the motor\'s load sensing instead of an endstop:', code: '[tmc2209 stepper_x]\ndiag_pin: ^PA1\ndriver_SGTHRS: 100   # 255 most sensitive, 0 least\n\n[stepper_x]\nendstop_pin: tmc2209_stepper_x:virtual_endstop\nhoming_retract_dist: 0' }
    ],
    questions: [
      { t: 'fill', q: 'TMC2209 section of the X motor', code: '[___ stepper_x]\nuart_pin: PC11\nrun_current: 0.6', o: ['tmc2209', 'driver', 'tmc', 'stepper_tmc'], a: 'tmc2209', e: 'The section name is driver model + stepper name.' },
      { t: 'mc', q: 'Which command changes motor current during a print?', o: ['SET_TMC_CURRENT STEPPER=stepper_x CURRENT=0.7', 'M906 X700', 'SET_CURRENT X=0.7', 'DUMP_TMC CURRENT=0.7'], a: 0, e: 'SET_TMC_CURRENT sets run and hold current.' },
      { t: 'mc', q: 'Which is true for driver_SGTHRS on the TMC2209?', o: ['255 most sensitive, 0 least', '0 most sensitive, 255 least', 'Only 0 or 1', 'It sets the current'], a: 0, e: 'On the TMC2209, higher values mean more sensitive stall detection.' },
      { t: 'fill', q: 'Endstop pin for sensorless homing', code: 'endstop_pin: ___', o: ['tmc2209_stepper_x:virtual_endstop', 'probe:z_virtual_endstop', '^PA1', 'stepper_x:diag'], a: 'tmc2209_stepper_x:virtual_endstop', e: 'This virtual pin is created once diag_pin is set.' },
      { t: 'mc', q: 'To see all the driver register values?', o: ['DUMP_TMC STEPPER=stepper_x', 'QUERY_TMC', 'GET_TMC', 'STATUS'], a: 0, e: 'DUMP_TMC reads every register for diagnosis.' },
      { t: 'tf', q: 'If the driver loses power and comes back, it can be re-initialized with INIT_TMC.', a: true, e: 'INIT_TMC rewrites the registers.' },
      { t: 'tf', q: 'SET_TMC_FIELD is the recommended permanent way for everyday settings.', a: false, e: 'No, it is for low-level diagnostics only. Permanent changes go in the config.' }
    ]
  }
  ]
},
{
  id: 'u9', title: 'Print Control and Issues', desc: 'Pause/resume, retraction, error messages', color: '#64748b', icon: '🛠️',
  lessons: [
  {
    id: 'u9l1', title: 'Pause, resume, cancel', doc: 'G-Codes.html#pause_resume',
    teach: [
      { title: '[pause_resume]', body: '• **PAUSE**: pauses the print and saves the position.\n• **RESUME**: returns to the saved position and continues (VELOCITY sets the return speed).\n• **CLEAR_PAUSE**: clears the paused state without resuming. Recommended in start G-code.\n• **CANCEL_PRINT**: cancels the print.' },
      { title: 'Printing files and excluding objects', body: '• **[virtual_sdcard] path:** sets the G-code folder on the host.\n• **SDCARD_PRINT_FILE FILENAME=…** starts a print.\n• With **[exclude_object]** you can cancel one part mid-print: **EXCLUDE_OBJECT NAME=…**\n• Filament sensor: **[filament_switch_sensor]**, query: **QUERY_FILAMENT_SENSOR**' }
    ],
    questions: [
      { t: 'mc', q: 'What goes in start G-code to clear a leftover paused state from the last print?', o: ['CLEAR_PAUSE', 'RESUME', 'CANCEL_PRINT', 'PAUSE'], a: 0, e: 'The docs recommend CLEAR_PAUSE so each print starts with a fresh pause state.' },
      { t: 'mc', q: 'Six parts on the bed, one came loose. The rest should continue, skip just that one. What do you need?', o: ['[exclude_object] + EXCLUDE_OBJECT NAME=…', 'CANCEL_PRINT', 'PAUSE', 'M112'], a: 0, e: 'exclude_object removes one object from the print. The slicer must label objects.' },
      { t: 'fill', q: 'Return slowly to a paused print', code: 'RESUME ___=20', o: ['VELOCITY', 'SPEED', 'F', 'RATE'], a: 'VELOCITY', e: 'RESUME VELOCITY=… sets the speed back to the saved position.' },
      { t: 'tf', q: 'With virtual_sdcard, Klipper can print G-code files on the host directly.', a: true, e: 'That is how Mainsail/Fluidd print files too.' },
      { t: 'type', q: 'Type the command that queries the filament sensor (without the SENSOR parameter)', a: ['QUERY_FILAMENT_SENSOR'], e: 'Queried with QUERY_FILAMENT_SENSOR SENSOR=<name>.' },
      { t: 'mc', q: 'How is M600 (filament change) used in Klipper?', o: ['Not built in; defined with gcode_macro', 'Built in', 'Add an [m600] section', 'Not supported at all'], a: 0, e: 'Klipper asks you to define non-standard G-codes as macros; M600 is usually a macro that uses PAUSE.' }
    ]
  },
  {
    id: 'u9l2', title: 'Firmware retraction', doc: 'G-Codes.html#firmware_retraction',
    teach: [
      { title: 'G10 / G11', body: 'With [firmware_retraction]:\n• **G10**: retract\n• **G11**: unretract\nSettings can change during a print:', code: '[firmware_retraction]\nretract_length: 0.8\nretract_speed: 35\n\nSET_RETRACTION RETRACT_LENGTH=0.6 RETRACT_SPEED=40\nGET_RETRACTION' },
      { title: 'Tip', body: 'Well-tuned pressure advance reduces the retraction you need. Per-filament SET_RETRACTION is usually put in the slicer\'s filament start G-code.' }
    ],
    questions: [
      { t: 'match', q: 'Match', pairs: [['G10', 'Retract'], ['G11', 'Unretract'], ['SET_RETRACTION', 'Change settings'], ['GET_RETRACTION', 'Show settings']], e: 'G10/G11 only work when [firmware_retraction] is defined.' },
      { t: 'fill', q: 'Set retraction length to 0.5 mm', code: 'SET_RETRACTION ___=0.5', o: ['RETRACT_LENGTH', 'LENGTH', 'DISTANCE', 'R'], a: 'RETRACT_LENGTH', e: 'Parameters: RETRACT_LENGTH, RETRACT_SPEED, UNRETRACT_EXTRA_LENGTH, UNRETRACT_SPEED.' },
      { t: 'tf', q: 'Well-tuned pressure advance can reduce the needed retraction.', a: true, e: 'The docs mention this.' },
      { t: 'mc', q: 'What does UNRETRACT_EXTRA_LENGTH do?', o: ['Pushes a bit more than was retracted on unretract', 'Lengthens retraction', 'Increases speed', 'Does a Z hop'], a: 0, e: 'Adds extra length on unretract.' },
      { t: 'mc', q: 'G10 gives "Unknown command". Why?', o: ['No [firmware_retraction] section', 'Nozzle is cold', 'Not homed', 'No M83'], a: 0, e: 'G10/G11 aren\'t defined until that section is added.' }
    ]
  },
  {
    id: 'u9l3', title: 'Error messages', doc: 'FAQ.html',
    teach: [
      { title: 'Common errors', body: '• **Must home axis first** → a move was requested before homing. G28 first.\n• **Move out of range** → the move goes outside position_min/max.\n• **Extrude below minimum temp** → nozzle is below min_extrude_temp.\n• **Heater … not heating at expected rate** → verify_heater; check wiring, sensor or cartridge.\n• **Unknown command** → the command doesn\'t exist or its section isn\'t in the config.' },
      { title: 'Where to look?', body: 'Detailed logs are in **klippy.log**. It is requested when reporting errors.\n\nTo leave the shutdown state: **FIRMWARE_RESTART**.' }
    ],
    questions: [
      { t: 'mc', q: 'At power on you sent G1 X50 and got "Must home axis first". Fix?', o: ['G28 first', 'FIRMWARE_RESTART', 'Increase position_max', 'M84'], a: 0, e: 'Klipper won\'t move an unhomed axis; it prevents crashing into the bed or frame.' },
      { t: 'mc', q: 'You sent G1 X300 with position_max: 235. Which error?', o: ['Move out of range', 'Must home axis first', 'Unknown command', 'Timer too close'], a: 0, e: 'The move is outside the limits.' },
      { t: 'match', q: 'Match the error with its fix', pairs: [['Must home axis first', 'Run G28'], ['Extrude below minimum temp', 'Heat the nozzle'], ['Unknown command: G10', 'Add [firmware_retraction]'], ['MCU shutdown', 'FIRMWARE_RESTART']], e: 'The error message usually tells you the fix.' },
      { t: 'mc', q: 'Name of Klipper\'s detailed log file?', o: ['klippy.log', 'printer.log', 'moonraker.cfg', 'error.txt'], a: 0, e: 'klippy.log; download it from the logs folder in Mainsail/Fluidd.' },
      { t: 'tf', q: 'Per the FAQ, after the motors are disabled with M84 Klipper forgets that the axes were homed.', a: true, e: 'Once released, position isn\'t certain; homing is needed again.' },
      { t: 'mc', q: 'For "Heater extruder not heating at expected rate", what do you check first?', o: ['Thermistor and heater cartridge connections', 'Bed mesh', 'Pressure advance', 'rotation_distance'], a: 0, e: 'This is a safety error. Check the hardware first; loosening settings is the last resort.' },
      { t: 'type', q: 'Type the command that leaves the shutdown state', a: ['FIRMWARE_RESTART'], e: 'FIRMWARE_RESTART resets both host and MCU error state.' }
    ]
  }
  ]
}
);
