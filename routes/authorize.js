// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE.txt in the project root for license information.
const querystring = require('querystring'),
express = require('express'),
router = express.Router(),
con = require('../bin/mysql'),
authHelper = require('../bin/auth'),
larstock = require('../bin/larstock'),
log = require('../bin/logger')

function relogin(status,res) {
	parms = querystring.stringify({
		'status': status
	})
	res.redirect('/login?' +parms)
}
/* POST /authorize. */
router.post('/', async function(req, res) {
	var username = req.body.username,
	password = req.body.password,
	sql = 'SELECT * FROM user_data WHERE userName = ?'
	if (username && password) {
		if (req.body.redirect) { var redirect = req.body.redirect }
		result = await con.q(sql,username)
		result = result[0]
		if (result !== undefined) {
			operator = await con.q('SELECT operator FROM privacy_data WHERE dataid = ?',result.dataid)
			if (password == result.password) {
				var data = {
					'dataid': result.dataid,
					'userid': result.emid,
					'username': result.name +' '+ result.lastName,
					'mail': result.mail,
					'operator': operator[0].operator
				}
				larstock.updateLar(username,result.dataid)
				authHelper.fortuneCookies(data,res)
				log.logger('info','test')
				if (redirect) { res.redirect(redirect) }
				else { res.redirect('/login') }
			} else { relogin('รหัสผ่านผิด',res) }
		} else { relogin('ไม่พบ username ในระบบ',res) }
	}
})

router.get('/', async function(req, res) {
	var username = req.query.username,
	password = req.query.password,
	sql = 'SELECT * FROM user_data WHERE userName = ?'
	if (username && password) {
		if (req.query.redirect) { var redirect = req.query.redirect }
		result = await con.q(sql,username)
		result = result[0]
		if (result !== undefined) {
			operator = await con.q('SELECT operator FROM privacy_data WHERE dataid = ?',result.dataid)
			if (password == result.password) {
				var data = {
					'dataid': result.dataid,
					'userid': result.emid,
					'username': result.name +' '+ result.lastName,
					'mail': result.mail,
					'operator': operator[0].operator
				}
				larstock.updateLar(username,result.dataid)
				authHelper.fortuneCookies(data,res)
				if (redirect) { res.redirect(redirect) }
				else { res.redirect('/login') }
			} else { relogin('รหัสผ่านผิด',res) }
		} else { relogin('ไม่พบ username ในระบบ',res) }
	}
})

/* GET /authorize/signout */
router.get('/signout', function(req, res, next) {

	authHelper.clearCookies(res);
	// Redirect to home
	res.redirect('/')
})

module.exports = router
