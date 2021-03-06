const express = require('express')
const router = express.Router()
const con = require("../bin/mysql")
const log = require("../bin/logger")
const report = require("../bin/exporteasypass")

/* GET /calendar. */
router.get('/',async function(req, res) {
	var userName = req.cookies.user_name,dataid = req.cookies.user_dataid,dataop = req.cookies.user_op,mail = req.cookies.user_mail
	if (userName) {
		data = {
			'username': userName,
			'dataid': dataid,
			'operator': dataop,
			'mail': mail
		}
		const result = await con.q("SELECT * FROM licenseplate_data JOIN easypass_data ON licenseplate_data.unixid = easypass_data.unixid")
		parms = {
			title: 'Easypass', 
			head1: 'ยอดเงินคงเหลือ', 
			head2: ' ' + userName,
			user: userName,
			operator: dataop,
			easypass: result
		}
	} else {
		res.redirect('/login')
	}
	res.render('easypass', { 
		moment: require('moment'),
		parms: parms
	})
})
//con.q("UPDATE user_data SET status = ? WHERE dataid = ?",[(a.status == "true" ? 1 : 0),a.dataid])
router.post('/', async function(req, res) {
	if (req.body.state == "topupc") {
		con.q("UPDATE licenseplate_data SET top = ? WHERE unixid = ?",[req.body.cash,req.body.scid])
		log.logger("info","change topup value of"+req.body.plate+" to "+req.body.cash+" by "+req.cookies.user_name)
	}
	res.end()
})

router.get('/download', async function(req, res) {
	await report.exp(res)
})

module.exports = router