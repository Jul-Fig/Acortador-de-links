process.env.NODE_ENV='test'

process.env.PORT =3001

if(process.env.SILENT_TEST=== 'true'){
    global.console ={
        ...console,
        log:jest.fn(),
        debug:jest.fn(),
        info:jest.fn(),
        warn:jest.fn(),
        error:jest.fn(),
    }
}