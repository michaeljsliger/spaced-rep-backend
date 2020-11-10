const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonParser = express.json()

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    // implement me
    res.send('implement me!')
  })

languageRouter
  .post('/guess', jsonParser, async (req, res, next) => {
    const db = req.app.get('db');
    const { guess, word } = req.body;
    // console.log(guess, word, req.user, req.language);
    // req.user.id comes from userAuth
    // and req.language.id comes from middleware

    // UPDATE language SET total_score = total_score + 1 WHERE req.language.user_id = req.user.id
    // UPDATE words SET correct_count = correct_count + 1 WHERE id === word.id

    // ALSO need to implement memory_value functionality
    if (guess === word.translation) {
      const updatedObj = await LanguageService.onCorrectGuess(db, word.id, req.user.id)

      res.json({
        guess: true,
        word: updatedObj.updatedWord,
        language: updatedObj.updatedLang,
      })

    } else {
      const updatedObj = await LanguageService.onWrongGuess(db, word.id, req.user.id)


      res.json({
        guess: false,
        word: updatedObj.updatedWord,
        language: updatedObj.updatedLang
      })
    }
    
  })

module.exports = languageRouter
