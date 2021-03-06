var express = require('express'),
router = express.Router(),
excel = require('../bin/excelexport'),
log = require('../bin/logger')

router.get('/', async function(req, res) {
    if (dataop < 3) { res.redirect('/') }
    var userName = req.cookies.user_name,dataid = req.cookies.user_dataid,dataop = req.cookies.user_op,mail = req.cookies.user_mail
	if (userName) {
		data = {
			'username': userName,
			'dataid': dataid,
			'operator': dataop,
			'mail': mail
		}
		parms = { title: 'HR นำออกข้อมูล', head1: 'HR Excel Export' }
		parms.user = userName
		parms.operator = dataop
	} else {
		res.redirect('/login')
    }
    res.render('hrexport', parms)
})

router.get('/export', async function(req, res) {
    excel.hrExport(req.query.datestart,req.query.dateend,res)
    log.logger('info','Excel Exported: '+ req.cookies.user_name)
})

router.post('/',async function(req,res) {
	rlink = '/hrexport/export?datestart='+req.body.datea+'&dateend='+req.body.dateb
	res.json(rlink)
})

module.exports = router