$(document).ready(function () {
  createBoard();
  $("table").click(function (event) {
    clickHandler(event);
  });
  wallHandler();

  $("#clearBtn").click(function () {
    clearBoard();
  });

  $("#btn").click(function () {
    bfs();
  });
});

function createBoard() {
  var id = 0;
  for (let index = 0; index < 20; index++) {
    var row = $("<tr></tr>");

    for (let j = 0; j < 30; j++) {
      var data = $(`<td id='${id}'></td>`);
      row.append(data);
      id++;
    }
    $("tbody").append(row);
  }
}

function clearBoard() {
  $(".visited").removeClass("visited");
  $(".startNode").removeClass("startNode");
  $(".endNode").removeClass("endNode");
  $(".active").removeClass("active");
  $(".wallNode").removeClass("wallNode");
}

function clickHandler(event) {
  var start = false;
  var end = false;

  if ($(".startNode").length === 0) {
    start = false;
  } else {
    start = true;
  }

  if ($(".endNode").length === 0) {
    end = false;
  } else {
    end = true;
  }

  var targetNode = $(event.target);

  if (targetNode.hasClass("wallNode")) {
    targetNode.removeClass("wallNode").removeClass("visited");
  } else if (targetNode.hasClass("startNode")) {
    targetNode.removeClass("startNode");
    start = false;
  } else if (targetNode.hasClass("endNode")) {
    targetNode.removeClass("endNode");
    end = false;
  } else if (!targetNode.hasClass("startNode") && !start) {
    targetNode.addClass("startNode");
    start = true;
  } else if (!targetNode.hasClass("startNode") && !end) {
    targetNode.addClass("endNode");
    end = true;
  }
}

function bfs() {
  var startNode = $(".startNode");

  var curNode = startNode;
  var queue = [];
  var father = [];

  queue.push(curNode);
  father[father[curNode.attr("id")]] = -1;

  while (queue) {
    var s = queue.shift();

    var siblings = getSiblings($(s));
    for (let i = 0; i < siblings.length; i++) {
      if (!$(siblings[i]).hasClass("visited")) {
        if (
          !$(siblings[i]).hasClass("startNode") &&
          !$(siblings[i]).hasClass("endNode")
        ) {
          $(siblings[i]).addClass("visited");
          father[$(siblings[i]).attr("id")] = $(s).attr("id");
        }
        queue.push(siblings[i]);
        if ($(siblings[i]).hasClass("endNode")) {
          father[$(siblings[i]).attr("id")] = $(s).attr("id");
          getPath(father);
          return;
        }
      }
    }
  }

  console.log("No paths");
}

function wallHandler() {
  var key = null;

  $("table").mousemove(function (event) {
    event.preventDefault();
    if (key === 17) {
      $(event.target).addClass("wallNode").addClass("visited");
    } else if (key === 16) {
      $(event.target).removeClass("wallNode").removeClass("visited");
    }
  });

  $(window).keydown(function (event) {
    key = event.which;
  });
  $(window).keyup(function (event) {
    key = null;
  });
}

function getPath(father) {
  var curNode = $(".endNode");
  var i = curNode.attr("id");
  while (father[i] != -1) {
    if (curNode != $(".endNode") && curNode != $(".startNode")) {
      curNode.removeClass("visited").addClass("active");
      i = father[i];
      curNode = $("#" + i);
    }
  }

  $(".startNode").removeClass("active").addClass("startNode");
  $(".endNode").removeClass("active").addClass("endNode");
}

function getSiblings(node) {
  var parent = node.parent();
  var row = parent[0].rowIndex;
  var cell = node[0].cellIndex;
  var table = document.getElementById("myTable");

  var siblings = [];

  if (row > 0) siblings.push(table.rows[row - 1].cells[cell]);
  if (row < table.rows.length - 1)
    siblings.push(table.rows[row + 1].cells[cell]);
  if (cell > 0) siblings.push(table.rows[row].cells[cell - 1]);
  if (cell < table.rows[row].cells.length - 1)
    siblings.push(table.rows[row].cells[cell + 1]);

  //console.log(siblings);
  return siblings;
}
