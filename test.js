const express = require('express');
const path = require('path');
const app = express();
var proxy = require('http-proxy-middleware');

app.use(express.static('/home/manan/Desktop/TestPrograms/marks-entry/'));
app.use('/api', proxy({target:'http://localhost:3000/', changeOrigin: true}));
// app.use('/', express.static('/home/manan/Desktop/Test Programs/marks-entry/'))
app.listen(9000);
