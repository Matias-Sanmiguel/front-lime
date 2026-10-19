import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateRegistration } from '../src/auth/registration.js'
const valid={name:'Ana',email:'ana@example.com',password:'12345678',birthDate:'2000-01-01',sex:'FEMALE',role:'USER'}
test('valid user and agency registration',()=>{
 assert.deepEqual(validateRegistration(valid),{})
 assert.deepEqual(validateRegistration({...valid,role:'AGENCY',agencyName:'Lime'}),{})
})
test('requires birth date, sex, agency name, valid email and password byte length',()=>{
 const errors=validateRegistration({...valid,birthDate:'2999-01-01',sex:'',email:'bad',password:'🔒'.repeat(20),role:'AGENCY'})
 for(const k of ['birthDate','sex','email','password','agencyName']) assert.ok(errors[k])
})
