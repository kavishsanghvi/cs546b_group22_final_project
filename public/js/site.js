// var verifyButton = $('.btn btn-primary');
// function verifyStudentStatus(todoItem){
//     todoItem.find('#verifyStatusID').on('click', function(event){
//         event.preventDefault();
//         var currentLink = $(this);
//         var currentID = currentLink.data('id');
//         console.log(currentID);

//         var requestConfig = {
//             // method = 'POST',
//             url: '/verifyStudent/' + currentID
//         };
//         $.ajax(requestConfig).then(function(responseMessage){
//             var newElement = $(responseMessage);
//             bindEventsToTodoItem(newElement);
//             todoItem.replaceWith(newElement);
//         });
//     });
// }(window.jQuery)