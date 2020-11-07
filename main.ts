//  Setup from Smart Home Kit for Smart fan, if the temperature is more than 30, system runs fan for 10 seconds
//  SMART HOME KIT - Temperature sensor external measures in degrees, and is not super stable - measure average value would be better (avg in 10 seconds)
//  Micro:bit - temperature sensor in processor, not so Math.round_with_precision(0, 0)
let temp = 0
OLED.init(128, 64)
serial.redirectToUSB()
let previous_temp = 0
basic.forever(function on_forever() {
    if (temp > 30) {
        music.startMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
        pins.digitalWritePin(DigitalPin.P1, 1)
        basic.pause(5000)
        pins.digitalWritePin(DigitalPin.P1, 0)
    } else {
        pins.digitalWritePin(DigitalPin.P1, 0)
    }
    
})
basic.forever(function temperature_average() {
    
    let timer_start = input.runningTimeMicros()
    let counter = 0
    let temp_counter = 0
    //  temp = smarthome.read_temperature(TMP36Type.TMP36_TEMPERATURE_C, AnalogPin.P2)
    //  serial.write_value("x", temp)
    //  serial.write_value("y", input.temperature())
    while (input.runningTimeMicros() - timer_start < 5000000) {
        temp_counter += smarthome.ReadTemperature(TMP36Type.TMP36_temperature_C, AnalogPin.P2)
        counter += 1
    }
    temp = Math.round(10 * (temp_counter / counter)) / 10
    if (temp != previous_temp) {
        OLED.clear()
        OLED.writeString("Temperature: ")
        OLED.writeNum(temp)
        previous_temp = temp
    }
    
})
