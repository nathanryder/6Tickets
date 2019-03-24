$(document).ready(function () {
    var approve = $("#approveBtn");
    var deleteBtn = $("#deleteBtn");

    approve.click(function (e) {
        e.preventDefault();
        approveEvent(approve.attr("eid"));
    });

    deleteBtn.click(function (e) {
        e.preventDefault();
        deleteEvent(deleteBtn.attr("eid"));
    });
});

function deleteEvent(eventId) {
    $.ajax({
        type: "DELETE",
        url: "/api/events/" + eventId,
        success: function() {
            Cookies.set("alert", "success:Successfully deleted event", {expires: 1});
            window.location.href = "/admin_index";
        },
        error: function() {
            Cookies.set("alert", "danger:Failed to delete event", {expires: 1});
            window.location.href = "/admin_index";
        }
    })
}

function approveEvent(eventId) {
    $.ajax({
        type: "GET",
        url: "/api/events/approve/" + eventId,
        success: function() {
            Cookies.set("alert", "success:Successfully approved event", {expires: 1});
            window.location.href = "/admin_index";
        },
        error: function() {
            Cookies.set("alert", "danger:Failed to approve event", {expires: 1});
            window.location.href = "/admin_index";
        }
    })
}