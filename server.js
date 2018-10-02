const Eris = require("eris");
var fs = require('fs');
var bot = new Eris("NDI0NTk5NjUzNzA3OTM5ODQx.DY7Oyg.0nefYorlIurf47RhFoh5acp_kL8");

var convR = [];
var convUserR = [];
var vocabR = [];
var bannedSentences = [];
var seqR = [];
var startWordR = [];
var startWordIIR = [];
var startWordIIIR = [];
var backupTimer = 0;

var currentContext = [];
var currentWordLength = 0;
var currentWords = [];

var lastSentenceType = "grs";

var message = "";
var respond = false;

bot.on("ready", () => {
  console.log("\n");
  {fs.readFile("memory/convR.txt", 'utf8', function(err, data){
    if(err) throw err;
    convR = JSON.parse(data);
    console.log("Loaded Conversation Register (convR)");
  });
  fs.readFile("memory/vocabR.txt", 'utf8', function(err, data){
    if(err) throw err;
    vocabR = JSON.parse(data);
    console.log("Loaded Vocabulary Register (vocabR)");
  });
  fs.readFile("memory/convUserR.txt", 'utf8', function(err, data){
    if(err) throw err;
    convUserR = JSON.parse(data);
    console.log("Loaded Conversation Usernames Register (convUserR)");
  });
  fs.readFile("memory/bannedSentences.txt", 'utf8', function(err, data){
    if(err) throw err;
    bannedSentences = JSON.parse(data);
    console.log("Loaded Banned Sentences Register (bannedSentences)");
  });
  fs.readFile("memory/seqR.txt", 'utf8', function(err, data){
    if(err) throw err;
    seqR = JSON.parse(data);
    console.log("Loaded Sequence Register (seqR)");
  });
  fs.readFile("memory/startWordR.txt", 'utf8', function(err, data){
    if(err) throw err;
    startWordR = JSON.parse(data);
    console.log("Loaded Start Words Register (startWordR)");
  });
  fs.readFile("memory/startWordIIR.txt", 'utf8', function(err, data){
    if(err) throw err;
    startWordIIR = JSON.parse(data);
    console.log("Loaded Start Words Register II (startWordIIR)");
  });
  fs.readFile("memory/startWordIIIR.txt", 'utf8', function(err, data){
    if(err) throw err;
    startWordIIIR = JSON.parse(data);
    console.log("Loaded Start Words Register III (startWordIIIR)");
  });
  fs.readFile("memory/backupTimer.txt", 'utf8', function(err, data){
    if(err) throw err;
    backupTimer = JSON.parse(data);
    console.log("Loaded backupTimer");
  });}
  //setTimeout(done, 10);
  //function done(){
    console.log("Succesfully 'remembered' everything!\n");
    console.log("*Yawn* Good morning.\n");
  //}
});


bot.on("messageCreate", (msg) => {
  //Regulating automatic backups
  var d = new Date();
  backupTimer++;
  fs.writeFile("memory/backupTimer.txt", JSON.stringify(backupTimer), function(err){
    if(err) throw err;
  } );
  if(backupTimer >= 100){
    backupTimer = 0;
    var rawName = "memory/autoBackups/"+ d.toString();
    var dirName = rawName.replace(":", ".").replace(":", ".");
    fs.mkdir(dirName, function(err){
      if(err){
        console.log("WARNING\nUnable to make backup!")
      }else{
        console.log("\nBackuping memory...");
        fs.writeFile(dirName+ "/backupTimer.txt", JSON.stringify(backupTimer), function(err){
          if(err) throw err;
        } );
        fs.writeFile("memory/backupTimer.txt", JSON.stringify(backupTimer), function(err){
          if(err) throw err;
        } );
        fs.writeFile(dirName+ "/bannedSentences.txt", JSON.stringify(bannedSentences), function(err){
          if(err) throw err;
        } );
        fs.writeFile(dirName+ "/convR.txt", JSON.stringify(convR), function(err){
          if(err) throw err;
        } );
        fs.writeFile(dirName+ "/convUserR.txt", JSON.stringify(convUserR), function(err){
          if(err) throw err;
        } );
        fs.writeFile(dirName+ "/seqR.txt", JSON.stringify(seqR), function(err){
          if(err) throw err;
        } );
        fs.writeFile(dirName+ "/startWordR.txt", JSON.stringify(startWordR), function(err){
          if(err) throw err;
        } );
        fs.writeFile(dirName+ "/startWordIIR.txt", JSON.stringify(startWordIIR), function(err){
          if(err) throw err;
        } );
        fs.writeFile(dirName+ "/startWordIIIR.txt", JSON.stringify(startWordIIIR), function(err){
          if(err) throw err;
        } );
        fs.writeFile(dirName+ "/vocabR.txt", JSON.stringify(vocabR), function(err){
          if(err) throw err;
        } );
        fs.readFile("memory/note.txt", 'utf8', function(err, data){
          if(err) throw err;
          fs.writeFile(dirName+ "/note.txt", data, function(err){
            if(err) throw err;
          } );
        }
        );
        console.log("Succesfully made backup!\n");
      };
    });
  }

  if(msg.content.length > 0){

    //Good console logging
    if(msg.author != "[ExtendedUser 424599653707939841]"){
      console.log("["+ msg.author.username + "] "+ msg.content);
    }else{
      console.log("[Dytebo] "+ msg.content);
    }

    //Filtering the ">>"
    if(msg.content.slice(0,2) == ">>"){
      message = msg.content.slice(2, msg.content.length);
      respond = true;
    }else{
      message = msg.content;
    }

    currentContext = [];

  //Regulating Conversation (User) Register
    convR[convR.length] = message;
    fs.writeFile("memory/convR.txt", JSON.stringify(convR), function(err){
      if(err) throw err;
    } );
    convUserR[convUserR.length] = msg.author.username;
    fs.writeFile("memory/convUserR.txt", JSON.stringify(convUserR), function(err){
      if(err) throw err;
    } );

    //Turning messages into words
    currentWords = [];
    for(var i = 0; i < message.length; i++){
      if(message[i] == " "){
        if(currentWordLength > 0){
          currentWords[currentWords.length] = message.slice(i-currentWordLength, i);
          currentWordLength = 0;
        }
      }else{currentWordLength++}
      if(i == message.length-1){
        currentWords[currentWords.length] = message.slice(i-currentWordLength+1, i+1);
        currentWordLength = 0;
      }
    }

    //Regulating Vocabulary Register
    if(msg.author != "[ExtendedUser 424599653707939841]"){
      for(var i = 0; i < currentWords.length; i++){
        var vocabLength = vocabR.length;
        var exists = -1;
        for(var j = 0; j < vocabLength; j++){
          if(currentWords[i] == vocabR[j][0]){
            exists = j;
            break;
          }
        }
        if(exists >= 0){
          for(var j = 0; j < currentWords.length; j++){
            if(j != i){
              vocabR[exists][ vocabR[exists].length ] = currentWords[j];
            }
          }
          for(var j = 0; j < vocabR[exists].length; j++){
            currentContext[currentContext.length] = vocabR[exists][j];
          }
          exists = -1;
        }else{
          vocabR[vocabR.length] = [currentWords[i]];
          for(var j = 0; j < currentWords.length; j++){
            if(j != i){
              vocabR[vocabR.length-1][ vocabR[vocabR.length-1].length ] = currentWords[j];
            }
          }
          for(var j = 0; j < vocabR[vocabR.length-1].length; j++){
            currentContext[currentContext.length] = vocabR[vocabR.length-1][j];
          }
        }
      }
      fs.writeFile("memory/vocabR.txt", JSON.stringify(vocabR), function(err){
        if(err) throw err;
      } );
    }

    //Regulating Sequence Register
    if(msg.author != "[ExtendedUser 424599653707939841]" && currentWords.length >= 3){
      for(var i = 0; i < currentWords.length-2; i++){
        var seqLength = seqR.length;
        var exists = -1;
        for(var j = 0; j < seqLength; j++){
          if([ currentWords[i], currentWords[i+1], currentWords[i+2] ] == seqR[j][0]){
            exists = j;
            break;
          }
        }
        if(exists >= 0 && i < currentWords.length-3){
          seqR[exists][ seqR[exists].length ] = currentWords[i+3];
        }else if(exists >= 0 && i == currentWords.length-3){
          seqR[exists][ seqR[exists].length ] = "█| END |█";
        }
        else if(i < currentWords.length-3){
          seqR[seqR.length] = [ [ currentWords[i], currentWords[i+1], currentWords[i+2] ], currentWords[i+3] ];
        }else if(i == currentWords.length-3){
          seqR[seqR.length] = [ [ currentWords[i], currentWords[i+1], currentWords[i+2] ], "█| END |█" ]
        }
      }
      fs.writeFile("memory/seqR.txt", JSON.stringify(seqR), function(err){
        if(err) throw err;
      } );
    }

    //Regulating Start Words Register
    if(msg.author != "[ExtendedUser 424599653707939841]" && currentWords[0].slice(0, 6).toLowerCase() != "dytebo"){
      if(currentWords.length == 1){
        startWordR[startWordR.length] = currentWords[0];
        fs.writeFile("memory/startWordR.txt", JSON.stringify(startWordR), function(err){
          if(err) throw err;
        } );
      }else if(currentWords.length == 2){
        startWordIIR[startWordIIR.length] = [ currentWords[0], currentWords[1] ];
        fs.writeFile("memory/startWordIIR.txt", JSON.stringify(startWordIIR), function(err){
          if(err) throw err;
        } );
      }else if(currentWords.length >= 3){
        startWordIIIR[startWordIIIR.length] = [ currentWords[0], currentWords[1], currentWords[2] ];
        fs.writeFile("memory/startWordIIIR.txt", JSON.stringify(startWordIIIR), function(err){
          if(err) throw err;
        } );
      }
    }


    //---------- RESPONSIVE SYSTEM -----------------------------------------------
    if(msg.author != "[ExtendedUser 424599653707939841]" && message.slice(0, 7) != "dytebo." && respond == true){
      bot.createMessage(msg.channel.id, generateSentence(message) );
      respond = false;
    }


    //-----COMMANDS---------------------------------------------------------------
    if(message === "dytebo.ping"){
      bot.createMessage(msg.channel.id, "Pong!");
      console.log("dytebo.ping -- Pong!");
    }
    if(message === "dytebo.help"){
      bot.createMessage(msg.channel.id, "Things I always answer to:\n"+
        "dytebo.help                           I show you this message again.\n"+
        "dytebo.ping                           Confirm that I am not dead.\n"+
        "dytebo.write <note>                   Let me write and save a note for you.\n"+
        "dytebo.read                           Do you want to read the note from dytebo.write?\n"+
        "dytebo.feedback dsta                  Tells me not to use my previous sentence again. (dsta = Don't Say That Again)");
      console.log("dytebo.help -- Showing help text");
    }
    if(message.slice(0, 12) === "dytebo.write"){
      fs.writeFile("memory/note.txt", message.slice(12, message.length, function(err){
        if(err) throw err;
        console.log("dytebo.write -- Writing: "+ message.slice(12, message.length));
      } ));
    }
    if(message === "dytebo.read"){
      fs.readFile("memory/note.txt", 'utf8', function(err, data){
        if(err) throw err;
        bot.createMessage(msg.channel.id, data);
        console.log("dytebo.read -- Reading: "+ data);
      }
      );
    }
    if(message === "dytebo.feedback dsta"){
      var fountIt = false;
      var foundWhere = 0;
      for(var i = convR.length; i > 0; i--){
        if(convUserR[i] == "DyTeBo"){
          foundIt = true;
          foundWhere = i;
          break;
        }
      }
      bannedSentences[bannedSentences.length] = convR[i];
      fs.writeFile("memory/bannedSentences.txt", JSON.stringify(bannedSentences), function(err){
        if(err) throw err;
      } );
      console.log("dytebo.feedback -- Learning!");
    }
  }
}

);
bot.connect();


//==============================================================================
//-------------------- SENTENCE GENERATOR  -------------------------------------
//==============================================================================
function generateSentence(msgContent){
  var words = [];
  var sentence = "";
  var returnSentence = "";
  var no = false;
  var continueWordLoop = true;
  var beginLength = 0;

  var lastWords = "";

  var random = Math.random();
  if(random < startWordR.length/(startWordR.length+startWordIIR.length+startWordIIIR.length) ){
    beginLength = 1;
  }else if(random < (startWordR.length+startWordIIR.length)/(startWordR.length+startWordIIR.length+startWordIIIR.length) ){
    beginLength = 2;
  }else{
    beginLength = 3;
  }

  if(beginLength == 1){
    var startTempList = [];
    for(var i = 0; i < startWordR.length; i++){
      for(var j = 0; j < currentContext.length; j++){
        if(startWordR[i] == currentContext[j]){startTempList[startTempList.length] = startWordR[i]}
      }
    }
    if(startTempList.length > 0){
      words[0] = startTempList[Math.floor(Math.random()*startTempList.length)];
    }else{
      words[0] = startWordR[Math.floor(Math.random()*startWordR.length)];
    };
  }

  if(beginLength == 2){
    var startTempList = [];
    for(var i = 0; i < startWordIIR.length; i++){
      var matchCounter = 0;
      for(var j = 0; j < currentContext.length; j++){
        if(startWordIIR[i][0] == currentContext[j]){matchCounter++};
        if(startWordIIR[i][1] == currentContext[j]){matchCounter++};
      }
      for(var j = 0; j < matchCounter; j++){
        startTempList[startTempList.length] = startWordIIR[i];
      }
    }
    if(startTempList.length > 0){
      words = startTempList[Math.floor(Math.random()*startTempList.length)];
    }else{
      words = startWordIIR[Math.floor(Math.random()*startWordIIR.length)];
    };
  }

  if(beginLength == 3){
    var startTempList = [];
    for(var i = 0; i < startWordIIIR.length; i++){
      var matchCounter = 0;
      for(var j = 0; j < currentContext.length; j++){
        if(startWordIIIR[i][0] == currentContext[j]){matchCounter++};
        if(startWordIIIR[i][1] == currentContext[j]){matchCounter++};
        if(startWordIIIR[i][2] == currentContext[j]){matchCounter++};
      }
      for(var j = 0; j < matchCounter; j++){
        startTempList[startTempList.length] = startWordIIIR[i];
      };
    };
    if(startTempList.length > 0){
      words = startTempList[Math.floor(Math.random()*startTempList.length)];
      for(var i = 0; i < startWordIIIR.length; i++){
        if(startWordIIIR[i] == words){var number = i}
      }
    }else{
      var number = Math.floor(Math.random()*startWordIIIR.length);
      words = startWordIIIR[number];
    };


    lastWords = words;
    lastWordsNumber = 0;

    var loopCounter = 0;
    do{
      for(var j = 0; j <= seqR.length; j++){
        if(j < seqR.length){
          if(seqR[j][0][0] == lastWords[0] && seqR[j][0][1] == lastWords[1] && seqR[j][0][2] == lastWords[2]){
            lastWordsNumber = j
            foundResult = true;
            break;
          }
        }else{
          continueWordLoop = false;
        }
      }
      var tempList = [];
      for(var i = 1; i < seqR[lastWordsNumber].length; i++){
        for(var j = 0; j < currentContext.length; j++){
          if(currentContext[j] == seqR[lastWordsNumber][i]){
            tempList[tempList.length] = currentContext[j];
          }
        }
      }
      var nextWord = "";
      if(tempList.length > 0){
        nextWord = tempList[ Math.floor(Math.random()*tempList.length) ];
      }else{
        nextWord = seqR[lastWordsNumber][ Math.floor(Math.random()*(seqR[lastWordsNumber].length-1))+1 ];
      }
      if(nextWord != "█| END |█"){
        words[words.length] = nextWord;
        startWordIIIR[number] = [ startWordIIIR[number][0], startWordIIIR[number][1], startWordIIIR[number][2] ];
        lastWords = [ words[words.length-3], words[words.length-2], words[words.length-1] ];
      }else{
        continueWordLoop = false;
      }
      loopCounter++
      if(loopCounter > 1000){
        continueWordLoop = false;
        console.log("\nWARNING\nInfinite (or super long) loop!\nTerminating sentence.");
      }
    }while(continueWordLoop);
  }

  for(var i = 0; i < words.length; i++){
    sentence = sentence + " " + words[i];
  }
  returnSentence = sentence;
  //checking if sentence is not banned
  for(var i = 0; i < bannedSentences.length; i++){
    if(returnSentence == bannedSentences[i]){
      no = true;
    }
  }
  if(no){
    generateSentence(msgContent);
  }else{
    return returnSentence;
  }
}
