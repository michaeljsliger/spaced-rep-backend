const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonParser = express.json()
const LinkedList = require('../dataStuctures/LinkedList')

const languageRouter = express.Router()

const LinkedListsPerID = {};

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
  .use(async (req, res, next) => {
    // LINKED LIST MIDDLEWARE
    if (!LinkedListsPerID[req.user.id]) {

      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      LinkedListsPerID[req.user.id] = new LinkedList();
      const LLiD = LinkedListsPerID[req.user.id];
      LLiD.removeAll();
      // truncate LL for ID on each get
      for (let i = words.length - 1; i >= 0; i--) {
        // insert first into LL backwards for linear time efficiency
        // the other option was to insertLast from the forwards, but that requires looping through LL
        LLiD.insertFirst(words[i]);
      }
    }
    next();
    })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      // loop over words, add all to LL
      // since we'll only do that once per ID, for the first time
      // on dashboard loads


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
    // getting the top element in the list
    // req.user.id
    const LLiD = LinkedListsPerID[req.user.id];

    res.json({ 
      language: req.language,
      word: LLiD.head.value,
     });
  })

languageRouter
  .post('/guess', jsonParser, async (req, res, next) => {
    const db = req.app.get('db');
    const { guess, word } = req.body;
    const LLiD = LinkedListsPerID[req.user.id];
    
    // ALSO need to implement memory_value functionality
    if (guess.memory_value > LLiD.length) guess.memory_value = LLiD.length;
    if (guess === word.translation) {
      // update DB
      const dbObj = await LanguageService.onCorrectGuess(db, word.id, req.user.id)
      
      // move new item around LL
      await LLiD.insertM(dbObj.updatedWord, dbObj.updatedWord.memory_value)
      
      res.json({
        guess: [true, guess],
        word: dbObj.updatedWord,
        language: dbObj.updatedLang,
      })
      
    } else {
      const dbObj = await LanguageService.onWrongGuess(db, word.id, req.user.id)
      
      await LLiD.insertM(dbObj.updatedWord, dbObj.updatedWord.memory_value)

      res.json({
        guess: [false, guess],
        word: dbObj.updatedWord,
        language: dbObj.updatedLang
      })
    }

  })

module.exports = languageRouter
