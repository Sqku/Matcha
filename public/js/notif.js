socket.on('message_notif', (data) => {
    $.notify({
        title: "You have a new Message :), ",
        message: data.sender_user_name+" sent you a message"
    },{
        allow_dismiss: true,
        placement: {
            from: "top",
            align: "left"
        },
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        }
    });
    $('#notif').html(count = count + 1);
})

socket.on('like_notif', (data) => {
//        alert("someone liked you "+ data.liked_id);
    $.notify({
        title: "You have a new Like :), ",
        message: data.like_user_name+" liked you"
    },{
        allow_dismiss: true,
        placement: {
            from: "top",
            align: "left"
        },
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        }
    });
    $('#notif').html(count = count + 1);
})

socket.on('dislike_notif', (data) => {
//        alert("someone liked you "+ data.liked_id);
    $.notify({
        title: "someone disliked you :(, ",
        message: data.dislike_user_name+" disliked you"
    },{
        allow_dismiss: true,
        placement: {
            from: "top",
            align: "left"
        },
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        }
    });
    $('#notif').html(count = count + 1);
})

socket.on('visit_notif', (data) => {
//        alert("someone liked you "+ data.liked_id);
    $.notify({
        title: "someone visited you :), ",
        message: data.visit_user_name+" visited you"
    },{
        allow_dismiss: true,
        placement: {
            from: "top",
            align: "left"
        },
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        }
    });
    $('#notif').html(count = count + 1);
})

socket.on('match_notif', (data) => {
    $.notify({
        title: "You have a match, ",
        message: "you matched with "+data.like_user_name
    },{
        allow_dismiss: true,
        placement: {
            from: "top",
            align: "left"
        },
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        }
    });
    $('#notif').html(count = count + 1);
})
