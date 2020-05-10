if(window.location.search){
  var url = window.location.search.toString();
  var qMap = url.split('=')
  console.log(url,qMap)
  if(qMap){
    var fetchUser = qMap[1];
    var name = atob(fetchUser);
    console.log(name)
    document.querySelector('.login-user').innerHTML = 'Welcome '+name
  } 
} else{
  alert('You are not authorised to give the exam')
  throw new Error("Unknown user!");
}

// Set the date we're counting down to
var cd = new Date();
cd.setMinutes(cd.getMinutes() + 50);
var countDownDate = cd.getTime();
console.log(countDownDate);
// Update the count down every 1 second

/*--------loader script-----------*/
$(function () {
  var loading = $("#loadbar").hide();
  $(document)
    .ajaxStart(function () {
      loading.show();
    })
    .ajaxStop(function () {
      loading.hide();
    });

  var questionNo = 0;
  var correctCount = 0;
  var x ;
  var q = loadQuestions()

  $("#qid").html(questionNo + 1);
  $("input:radio").prop("checked", false);
  setTimeout(function () {
    $("#quiz").show();
    $("#loadbar").fadeOut();
  }, 500);
  $("#question").html(q[questionNo].Q);
  $($("#f-option").parent().find("label")).html(q[questionNo].C[0]);
  $($("#s-option").parent().find("label")).html(q[questionNo].C[1]);
  $($("#t-option").parent().find("label")).html(q[questionNo].C[2]);
  $($("#fr-option").parent().find("label")).html(q[questionNo].C[3]);


  $(document.body).on("click", "label.element-animation", function (e) {
    //ripple start
    var parent, ink, d, x, y;
    parent = $(this);
    if (parent.find(".ink").length == 0)
      parent.prepend("<span class='ink'></span>");

    ink = parent.find(".ink");
    ink.removeClass("animate");

    if (!ink.height() && !ink.width()) {
      d = Math.max(parent.outerWidth(), parent.outerHeight());
      ink.css({ height: "100px", width: "100px" });
    }

    x = e.pageX - parent.offset().left - ink.width() / 2;
    y = e.pageY - parent.offset().top - ink.height() / 2;

    ink.css({ top: y + "px", left: x + "px" }).addClass("animate");
    //ripple end

    var choice = $(this).parent().find("input:radio").val();
    var anscheck = $(this).checking(questionNo, choice); //$( "#answer" ).html(  );
    q[questionNo].UC = choice;
    if (anscheck) {
      correctCount++;
      q[questionNo].result = "Correct";
    } else {
      q[questionNo].result = "Incorrect";
    }

    setTimeout(function () {
      $("#loadbar").show();
      $("#quiz").fadeOut();
      questionNo++;
      if (questionNo + 1 > q.length) {
        if(x){

        }
        completeQuiz();
      } else {
        $("#qid").html(questionNo + 1);
        $("input:radio").prop("checked", false);
        setTimeout(function () {
          $("#quiz").show();
          $("#loadbar").fadeOut();
        }, 500);
        $("#question").html(q[questionNo].Q);
        $($("#f-option").parent().find("label")).html(q[questionNo].C[0]);
        $($("#s-option").parent().find("label")).html(q[questionNo].C[1]);
        $($("#t-option").parent().find("label")).html(q[questionNo].C[2]);
        $($("#fr-option").parent().find("label")).html(q[questionNo].C[3]);
      }
    }, 0);
  });
  function completeQuiz() {
    alert("Quiz completed, Now click ok to get your answer");
    if($('.quiz-window'))
    $('.quiz-window').hide();
    $("label.element-animation").unbind("click");
    if (x) {
      clearInterval(x);
      document.getElementById("timer").innerHTML = "EXPIRED";
    }
    setTimeout(function () {
      var toAppend = "";
      $.each(q, function (i, a) {
        toAppend += "<tr>";
        toAppend += "<td>" + a.Q + "</td>";
        toAppend += "<td>" + a.C[a.A-1] + "</td>";
        toAppend += "<td>" + (a.UC ? a.C[a.UC-1] : "Unattempted") + "</td>";
        toAppend += "<td>" + (a.result ? a.result : "No Score") + "</td>";
        toAppend += "</tr>";
      });
      $("#quizResult").html(toAppend);
      $("#totalCorrect").html("Total correct: " + correctCount);
      $("#quizResult").show();
      $("#loadbar").fadeOut();
      $("#result-of-question").show();
      $("#graph-result").show();
      $("#chartdiv").show();
      chartMake();
    }, 1000);
  }
  x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("timer").innerHTML =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      completeQuiz();
      document.getElementById("timer").innerHTML = "EXPIRED";
    }
  }, 1000);

  $.fn.checking = function (qstn, ck) {
    var ans = q[questionNo].A;
    if (ck != ans) return false;
    else return true;
  };

  function chartMake() {
    AmCharts.makeChart("chartdiv", {
      type: "serial",
      theme: "dark",
      dataProvider: [
        {
          name: "Correct",
          points: correctCount,
          color: "#00FF00",
          bullet:
            "http://i2.wp.com/img2.wikia.nocookie.net/__cb20131006005440/strategy-empires/images/8/8e/Check_mark_green.png?w=250",
        },
        {
          name: "Incorrect",
          points: q.length - correctCount,
          color: "red",
          bullet:
            "http://4vector.com/i/free-vector-x-wrong-cross-no-clip-art_103115_X_Wrong_Cross_No_clip_art_medium.png",
        },
      ],
      valueAxes: [
        {
          maximum: q.length,
          minimum: 0,
          axisAlpha: 0,
          dashLength: 4,
          position: "center",
        },
      ],
      startDuration: 1,
      graphs: [
        {
          balloonText:
            "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
          bulletOffset: 10,
          bulletSize: 52,
          colorField: "color",
          cornerRadiusTop: 8,
          customBulletField: "bullet",
          fillAlphas: 0.8,
          lineAlpha: 0,
          type: "column",
          valueField: "points",
        },
      ],
      marginTop: 0,
      marginRight: 0,
      marginLeft: 0,
      marginBottom: 0,
      autoMargins: false,
      categoryField: "name",
      categoryAxis: {
        axisAlpha: 0,
        gridAlpha: 0,
        inside: true,
        tickLength: 0,
      },
    });
  }
});





function loadQuestions(){
  return [
    {
      Q: `What is the output of the following code :<br></br> L = ['a','b','c','d']<br></br> print "".join(L)`,
      A: 3,
      C: ["Error", "None", "abcd", `['a','b','c','d']`],
    },
    {
      Q: `Suppose list1 is [3, 4, 5, 20, 5, 25, 1, 3], what is list1 after list1.pop(1)?`,
      A: 3,
      C: [
        "[3, 4, 5, 20, 5, 25, 1, 3]",
        "[1, 3, 3, 4, 5, 5, 20, 25]",
        "[3, 5, 20, 5, 25, 1, 3]",
        `[1, 3, 4, 5, 20, 5, 25]`,
      ],
    },
    {
      Q: "What is the output of the following code :<br></br>print 9//2",
      A: 2,
      C: ["4.5", "4", "4.0", "Error"],
    },
    {
      Q:
        "What is the output of the following code:<br></br>i = 0<br></br>while i < 3:<br></br>  &nbsp; &nbsp; &nbsp; print i<br></br>  &nbsp; &nbsp; &nbsp; i++<br></br>print i+1",
      A: 1,
      C: ["Error", "021324", "012345", "102435"],
    },
    {
      Q: `What is the output of the following program : <br></br> print "Hello World"[::-1]`,
      A: 1,
      C: ["dlroW olleH", "Hello Worl", "d", "Error"],
    },
    {
      Q: `Given a function that does not return any value, what value is shown when executed at the shell?`,
      A: 4,
      C: ["int", "bool", "void", "None"],
    },
    {
      Q: `Given a string s = "Welcome", which of the following code is incorrect?`,
      A: 2,
      C: ["print s[0]", `s[1] = 'r'`, "print s.lower()", "print (s.strip())"],
    },
    {
      Q: `To start Python from the command prompt, use the command ______`,
      A: 1,
      C: ["python", "go python", "execute python", "run python "],
    },
    {
      Q: `Which of the following is correct about Python?`,
      A: 3,
      C: [
        "It supports automatic garbage collection.",
        "It can be easily integrated with C, C++, COM, ActiveX, CORBA, and Java",
        "Both of the above",
        "None of the above",
      ],
    },
    {
      Q: `Which of these is not a core data type?`,
      A: 4,
      C: ["Lists", "Dictionary", "Tuples", "Class"],
    },
    {
      Q: `What data type is the object below ? <br></br> L = [1, 23, 'hello', 1]`,
      A: 1,
      C: ["List", "Dictionary", "Tuple", "Array"],
    },
    {
      Q: `Which of the following function convert a string to a float in python?`,
      A: 3,
      C: ["int(x [,base])", "long(x [,base] )", "float(x)", "str(x)"],
    },
    {
      Q: `What is the output of the expression : <br></br> 3*1**3`,
      A: 3,
      C: ["27", "9", "3", "1"],
    },
    {
      Q: `What is the output of the following program : <br></br> i = 0 <br></br> while i < 3: <br></br> &nbsp;&nbsp;&nbsp; print i <br></br> &nbsp;&nbsp;&nbsp; i += 1 <br></br> else: <br></br> &nbsp;&nbsp;&nbsp; print 0`,
      A: 2,
      C: ["0 1 2 3 0", "0 1 2 0", "0 1 2", "Error"],
    },
    {
      Q: `What is the output of the following program : <br></br> print 'abcefd'.replace('cd', '12')`,
      A: 2,
      C: ["ab1ef2", "abcefd", "ab1efd", "ab12ed2"],
    },
    {
      Q: `What will be displayed by the following code? <br><br> def f(value, values): <br></br> &nbsp;&nbsp;&nbsp; v = 1 <br></br> &nbsp;&nbsp;&nbsp; values[0] = 44 <br></br> t = 3 <br></br> v = [1, 2, 3] <br></br> f(t, v)\nprint(t, v[0])`,
      A: 4,
      C: ["1 1", "1 44", "3 1", "3 44"],
    },
    {
      Q: `What will be the output of the following code?<br></br>minidict = { 'name': 'Chirag', 'name': 'Deepak'}<br></br>print(minidict['name'])`,
      A: 3,
      C: ["Chirag", `('Chirag' , 'Deepak')`, "Deepak", "Error"],
    },
    {
      Q: `What is the output of the following dictionary operation<br></br>dict1 = {"name": "Dinesh", "salary": 8000}<br></br>print(dict1['age'])`,
      A: 1,
      C: ['KeyError: "age"', "None", "Mike", "8000"],
    },
    {
      Q: `What is the output of the following code <br></br> dict1 = {'key1':1, 'key2':2} <br></br> dict2 = {'key2':2, 'key1':1} <br></br> print(dict1 == dict2)`,
      A: 2,
      C: ["False", "True", "Error", "Exception"],
    },
    {
      Q: `Select the correct way to get the value of marks key.<br></br>student = { <br></br> &nbsp;&nbsp;&nbsp; "name": "Emma", <br></br> &nbsp;&nbsp;&nbsp; "class": 9, <br></br> &nbsp;&nbsp;&nbsp; "marks": 75 <br></br>}`,
      A: 4,
      C: [
        "m = student.get(2)",
        "m = student[2])",
        "m = student[])",
        `m = student.get('marks')`,
      ],
    },
    {
      Q: "Which of the following commands will create a list?",
      A: 4,
      C: [
        "list1 = list();",
        "list1 = [];",
        "list1 = list([1, 2, 3]);",
        "all of the mentioned;",
      ],
    },
    {
      Q: "What is the output when we execute list('hello')?",
      A: 1,
      C: ["['h', 'e', 'l', 'l', 'o']", "['hello']", "['llo']", "['olleh']"],
    },
    {
      Q:
        "Suppose listExample is ['h', 'e', 'l', 'l', 'l'], what is len(listExample)?",
      A: 1,
      C: ["5", "4", "None", "Error"],
    },

    {
      Q: "Suppose list1 is [2445,133,12454,123], what is max(list1)?",
      A: 3,
      C: ["2445", "133", "12454", "123"],
    },
    {
      Q: "Suppose list1 is [1, 3, 2], What is list1 * 2?",
      A: 3,
      C: [
        " [2, 6, 4]",
        "[1, 3, 2, 1, 3]",
        "[1, 3, 2, 1, 3, 2]",
        " [1, 3, 2, 3, 2, 1]",
      ],
    },
    {
      Q: "To add a new element to a list we use which command?",
      A: 2,
      C: [
        "list1.add(5)",
        "list1.append(5)",
        "list1.addLast(5)",
        "list1.addEnd(5)",
      ],
    },
    {
      Q: "If a=(1,2,3,4), a[1:-1] is _________",
      A: 4,
      C: ["Error, tuple slicing doesnt exist", "[2,3]", "(2,3,4)", "(2,3)"],
    },
    {
      Q: " What is the data type of (1)?",
      A: 2,
      C: ["Tuple", "Integer", "List", "Both tuple and integer"],
    },
    {
      Q: `Suppose d = {"john":40, "peter":45}, to delete the entry for 'john' what command do we use?`,
      A: 3,
      C: [
        `d.delete("john":40)`,
        `d.delete("john")`,
        `del d["john"]`,
        `del d("john":40)`,
      ],
    },
    {
      Q: `Suppose d = {"john":40, "peter":45}. To obtain the number of entries in dictionary which command do we use?`,
      A: 2,
      C: [" d.size()", "len(d)", "size(d)", "d.len()"],
    },
    {
      Q: "What are the two main types of functions?",
      A: 2,
      C: [
        "Custom function",
        "Built-in function & User defined function",
        "User function",
        "System function",
      ],
    },
    {
      Q: "Where is function defined?",
      A: 4,
      C: ["Module", "Class", "Another function", "All of the mentioned"],
    },
    {
      Q: "What is a variable defined outside a function referred to as?",
      A: 2,
      C: [
        " A static variable",
        "A global variable",
        "A local variable",
        "An automatic variable",
      ],
    },
    {
      Q:
        "If a function doesn't have a return statement, which of the following does the function return?",
      A: 3,
      C: [
        "int",
        "null",
        "None",
        " An exception is thrown without the return statement",
      ],
    },
    {
      Q: "Syntax of constructor in Python?",
      A: 1,
      C: ["def __init__()", "def _init_()", "_init_()", "All of these"],
    },
    {
      Q: "The format function, when applied on a string returns :",
      A: 4,
      C: ["list", "bool", "int", "str"],
    },
    {
      Q: "print(chr(ord('b')+1))",
      A: 3,
      C: ["b", "syntax error", "c", "b+1"],
    },
    {
      Q: "Which statement is correct....??",
      A: 1,
      C: [
        " List is mutable && Tuple is immutable",
        "List is immutable && Tuple is mutable",
        "Both are Immutable",
        "Both are Mutable",
      ],
    },
    {
      Q: "Which of the following is an invalid statement?",
      A: 2,
      C: [
        "abc = 1,000,000",
        "a b c = 1000 2000 3000",
        "a,b,c = 1000, 2000, 3000",
        "a_b_c = 1,000,000",
      ],
    },
    {
      Q: "Suppose list1 is [2, 33, 222, 14, 25], What is list1[-1] ?",
      A: 2,
      C: ["Error", "25", "None", "2"],
    },
    {
      Q: "Which one of the following is not a python's predefined data type?",
      A: 1,
      C: ["Class", "List", "Dictionary", "Tuple"],
    },
    {
      Q: "What will be the output of 7^10 in python?",
      A: 1,
      C: ["13", "2", "15", "None"],
    },
    {
      Q: "19 % 2 in python",
      A: 4,
      C: ["17", "2", "0", "None"],
    },
    {
      Q: "Which of the following has more precedance?",
      A: 4,
      C: ["+", "/", "-", "()"],
    },
    {
      Q: "Is Python case sensitive?",
      A: 1,
      C: ["Yes", "No", "Depends on Python Version"],
    },
    {
      Q: `def foo(k):<br/>
          &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; k = [1] <br/>
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; q = [0] <br/>
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; foo(q) <br/>
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; print(q) <br/>`,
      A: 1,
      C: ["[0]", "[1]", "[1,0]", "[0,1]"],
    },
    {
      Q: "How do you create a variable with the numeric value 5?",
      A: 4,
      C: [" x = 5", " x = int(5)", " x = 5.0", " All the options are correct"],
    },
    {
      Q: "What is the correct file extension for Python files?",
      A: 1,
      C: [".py", " .pt", ".pyth", ".p"],
    },
    {
      Q: "How do you create a variable with the floating number 2.8?",
      A: 3,
      C: ["x=2.3", "x=float(2.8)", " I & II", "None of the above"],
    },
    {
      Q: "What is the correct way to create a function in Python?",
      A: 3,
      C: [
        " function myfunction():",
        " myfunction():",
        " def myfunction():",
        " myfunction(args):",
      ],
    },
    {
      Q: `In Python, 'Hello', is the same as "Hello"?`,
      A: 1,
      C: [" True", " False", " -", " -"],
    },
    {
      Q: "What is a correct syntax to return the first character in a string?",
      A: 1,
      C: [
        '  x = "Hello"[0]',
        '  x = sub("Hello", 0, 1)',
        '  x = "Hello".sub(0, 1)',
        "  None of the above",
      ],
    },
    {
      Q: "Which method can be used to return a string in upper case letters?",
      A: 3,
      C: ["  upperCase()", "  uppercase()", "  upper()", "  toUpperCase()"],
    },
    {
      Q:
        "Which method can be used to remove any whitespace from both the beginning and the end of a string?",
      A: 2,
      C: [" strip()", " trim()", " pTrim()", " len()"],
    },
    {
      Q: "Which method can be used to replace parts of a string?",
      A: 2,
      C: ["  replaceString()", "  replace()", "  repl()", "  switch()"],
    },
    {
      Q: "Which operator can be used to compare two values?",
      A: 4,
      C: ["  =", "  <>", "  !=", "  =="],
    },
    {
      Q: "Which of these collections defines a LIST?",
      A: 4,
      C: [
        '   {"apple", "banana", "cherry"}',
        '   {"name": "apple", "color": "green"}',
        '   ("apple", "banana", "cherry")',
        '   ["apple", "banana", "cherry"]',
      ],
    },
    {
      Q: `Print ("Hello") <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Print ("Hello")?`,
      A: 4,
      C: ["  Hello", "  Hello Hello", "  None", "  Error"],
    },
    {
      Q:
        "What will be the output of the following code <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; output=1 + 'Hello'",
      A: 3,
      C: ["  1Hello", "  1", "  None", "  Error"],
    },
    {
      Q:
        "What will be the output of the following code <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; list= (1,2,3) <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; print (list)",
      A: 3,
      C: ["  [1,2,3,4]", "  None", "  Error", "  [1,2,3]"],
    },
    {
      Q: "Which of the following data types is not supported in python?",
      A: 4,
      C: ["  Numbers", "  List", "  complex", "  slice"],
    },
    {
      Q: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; D = {1 : {'A' : {1 : "A"}, 2 : "B"}, 3 :"C", 'B' : "D", "D": 'E'}<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; print(D[D[D[1][2]]], end = " ")
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; print(D[D[1]["A"][2]])`,
      A: 4,
      C: ["  D C", "  E B", "  D B", "  E KeyError"],
    }
  ];

}