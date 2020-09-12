/* THE PATHFIDING JS FILE
 * AUTHOR @hugoBuissez
 */

$(document).ready(function () {
  createBoard();
  $("table").click(function (event) {
    event.preventDefault();

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

// This function creates the board
// For the moment, no choice on the size
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
    $("#res").css("visibility", "hidden");
  }
}

// Reset the board
function clearBoard() {
  $(".visited").removeClass("visited");
  $(".startNode").removeClass("startNode");
  $(".endNode").removeClass("endNode");
  $(".active").removeClass("active");
  $(".wallNode").removeClass("wallNode");
  $("#res").css("visibility", "hidden");
}

// Hook for the click event
// Adding color on the board corresponding to the node's role
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

// The click to add a wall node is in a different function
// User has to keep Ctrl key pressed while clicking
// Shift key to erase
function wallHandler() {
  var key = null;

  $("table").mousemove(function (event) {
    event.preventDefault();
    if (key === 17) {
      if (
        !$(event.target).hasClass("startNode") &&
        !$(event.target).hasClass("endNode")
      )
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

// Function that get the shortest path
// Relying on the father vector
function getPath(father) {
  var pathLength = 0;
  var path = [];
  var curNode = $(".endNode");
  var i = curNode.attr("id");
  var time = 1;

  while (father[i] != -1) {
    if (curNode != $(".endNode") && curNode != $(".startNode")) {
      pathLength++;

      //curNode.removeClass("visited").addClass("active");

      i = father[i];
      path.push(curNode);
      curNode = $("#" + i);
    }
  }

  $(".startNode").removeClass("active").addClass("startNode");
  $(".endNode").removeClass("active").addClass("endNode");

  return path;
}

// Function that animate the path
function animPath(path) {
  for (let i = 0; i < path.length; i++) {
    setTimeout(function () {
      $(path[i]).removeClass("visited").addClass("active", 1000);
    }, i * 20);
  }
}

// Function that return the siblings vector of a node
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

  return siblings;
}

// Breadth-first search algorithm
function bfs() {
  var startNode = $(".startNode");

  var curNode = startNode;
  var queue = [];
  var father = [];
  let i = 0;

  queue.push(curNode);
  father[father[curNode.attr("id")]] = -1;

  while (queue.length != 0) {
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
          path = getPath(father);
          console.log(path);
          path.shift();
          path.pop();
          path.reverse();
          animPath(path);
          getRes(path.length);

          return;
        }
      }
    }
  }
  getRes(-1);
}

// Function that display the result
// Plus the length of the path if there is one
function getRes(res) {
  if (res === -1) {
    $("#res").css("color", "#c9111c");
    $("#res").css("visibility", "visible");
    $("#res").html("No path for this configuration");
  } else {
    $("#res").css("color", "#0077cc");
    $("#res").css("visibility", "visible");

    $("#res").html(`The shortest path is ${res} boxes`);
  }
}
