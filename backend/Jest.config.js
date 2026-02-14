require('dotenv').config({ path: '.env.test'})

module.export ={

    testEnviroment: 'node',

    testMatch:[
        '**/test**/*.test.js',
        '**/__test__/**/*.js'
    ],


    collectCoverageFrom:[
        'controllers/**/*.js',
        'middleware/**/*.js',
        'models/**/*.js',
        'utils/**/*.js',
        '!**/node_modeles/**'
    ],

    coverageThreshold:{
        globa:{
            branches: 70,
            functions:70,
            lines:70,
            statements:70
        }
    },

    coverageDirectory:'coverage',

    coverageReporters:['text', 'lcov','html'],


    testTimeout:30000,

    clearMocks:true,

    verbose:true,

    testRunner:'jest-circus/runner',
    maxWorkers:1,

    setupFiles:['<rootDir>/test/setup.js']

}