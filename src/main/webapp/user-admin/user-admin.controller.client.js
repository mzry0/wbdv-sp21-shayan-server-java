var $usernameFld
var $passwordFld
var $firstnameFld
var $lastnameFld
var $roleFld
var tableBody
var $createIcon
var $updateIcon
var userService = new AdminUserServiceClient()

// function addUser() {
//     createUser({
//         username: 'NEW USER',
//         password: 'obvious_password',
//         firstname: 'Ben',
//         lastname: 'Moore',
//         role: 'FACULTY'
//     })
// }
var users = [];

function createUser(user) {
    userService.createUser(user)
        .then(function (actualUser) {
            users.push(actualUser)
            renderUsers(users)
        })
}

var selectedCourse = null
function selectCourse(event) {
    var selectBtn = jQuery(event.target)
    var theId = selectBtn.attr("id")
    selectedCourse = users.find(course => course._id === theId)
    titleFld.val(selectedCourse.title)
    $seatsFld.val(selectedCourse.seats)
    $semesterFld.val(selectedCourse.semester)
}

function deleteUser(event) {
    console.log(event.target)
    var deleteIcon = jQuery(event.target)
    var theClass = deleteIcon.attr("class")
    var deleteIconId = deleteIcon.attr("id")
    var userId = deleteIconId.substring(deleteIconId.indexOf(':')+1)
    var userIndex = users.findIndex((user) => user._id === userId)
    // var theId = users[theIndex]._id
    console.log('uid: '+userId)
    console.log('index: '+userIndex)

    userService.deleteUser(userId)
        .then(function (status) {
            users.splice(userIndex, 1)
            renderUsers(users)
        })
}

function renderUsers(users) {
    theTableBody.empty()
    for (var i = 0; i < users.length; i++) {
        var user = users[i]
        theTableBody
            .prepend(`
    <tr>
        <td>${user.username}</td>
        <td>${user.password}</td>
        <td>${user.firstname}</td>
        <td>${user.lastname}</td>
        <td>${user.role}</td>
        <td>
            <span class="pull-right" style="white-space: nowrap">
            <i class="fa fa-2x fa-times-circle wbdv-delete" id="wbdv-delete:${user._id}"></i>
            <i class="fa fa-2x fa-edit wbdv-select" id="wbdv-select:${user._id}"></i>
            </span>
        </td>
    </tr>
  `)
    }
    jQuery(".wbdv-delete")
        .click(deleteUser)
    jQuery(".wbdv-select")
        .click(selectCourse)
}

function updateCourse() {
    console.log(selectedCourse)
    selectedCourse.title = titleFld.val()
    selectedCourse.seats = $seatsFld.val()
    selectedCourse.semester = $semesterFld.val()
    courseService.updateCourse(selectedCourse._id, selectedCourse)
        .then(function (status) {
            var index = users.findIndex(course => course._id === selectedCourse._id)
            users[index] = selectedCourse
            renderUsers(users)
        })
}

function init() {
    $usernameFld = $(".wbdv-username-fld")
    $passwordFld = $(".wbdv-password-fld")
    $firstnameFld = $(".wbdv-firstname-fld")
    $lastnameFld = $(".wbdv-lastname-fld")
    $roleFld = $(".wbdv-role-fld")
    $createIcon = jQuery(".wbdv-create-icon")
    // addUserIcon.click(addUser)
    $updateBtn = $(".wbdv-update-btn")
    theTableBody = jQuery("tbody")

    $updateBtn.click(updateCourse)
    $createIcon.click(() => {
            createUser({
                username: $usernameFld.val(),
                password: $passwordFld.val(),
                firstname: $firstnameFld.val(),
                lastname: $lastnameFld.val(),
                role: $roleFld.val()
            })
            $usernameFld.val("")
            $passwordFld.val("")
            $firstnameFld.val("")
            $lastnameFld.val("")
            $roleFld.prop('selectedIndex',0)
        }
    )

    userService.findAllUsers()
        .then(function (actualUsersFromServer) {
            users = actualUsersFromServer
            renderUsers(users)
        })
}
jQuery(init)