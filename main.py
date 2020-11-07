# Setup from Smart Home Kit for Smart fan, if the temperature is more than 30, system runs fan for 10 seconds
# SMART HOME KIT - Temperature sensor external measures in degrees, and is not super stable - measure average value would be better (avg in 10 seconds)
# Micro:bit - temperature sensor in processor, not so Math.round_with_precision(0, 0)
temp = 0
OLED.init(128, 64)
serial.redirect_to_usb()
previous_temp = 0

def on_forever():
    if temp > 30:
        music.start_melody(music.built_in_melody(Melodies.BA_DING), MelodyOptions.ONCE)
        pins.digital_write_pin(DigitalPin.P1, 1)
        basic.pause(5000)
        pins.digital_write_pin(DigitalPin.P1, 0)
    else:
        pins.digital_write_pin(DigitalPin.P1, 0)
basic.forever(on_forever)

def temperature_average():
    global temp, previous_temp
    timer_start = input.running_time_micros()
    counter = 0
    temp_counter = 0
    # temp = smarthome.read_temperature(TMP36Type.TMP36_TEMPERATURE_C, AnalogPin.P2)
    # serial.write_value("x", temp)
    # serial.write_value("y", input.temperature())
    while input.running_time_micros() - timer_start < 5000000:
        temp_counter += smarthome.read_temperature(TMP36Type.TMP36_TEMPERATURE_C, AnalogPin.P2)
        counter += 1

    temp = Math.round(10*(temp_counter / counter))/10
    if temp != previous_temp:
        OLED.clear()
        OLED.write_string("Temperature: ")
        OLED.write_num(temp)
        previous_temp = temp
basic.forever(temperature_average)
