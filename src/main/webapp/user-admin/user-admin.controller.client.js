(function() {
    var $usernameFld
    var $passwordFld
    var $firstnameFld
    var $lastnameFld
    var $roleFld
    var $createIcon
    var $updateIcon
    var userService = new AdminUserServiceClient()

    var users = [];

    function createUser(user) {
        userService.createUser(user)
            .then(function (actualUser) {
                users.push(actualUser)
                renderUsers(users)
            })
    }

    var selectedUser = null

    function selectUser(event) {
        var selectIcon = jQuery(event.target)
        var selectIconId = selectIcon.attr("id")
        var userId = selectIconId.substring(selectIconId.indexOf(':') + 1)
        selectedUser = users.find(user => user._id === userId)
        $usernameFld.val(selectedUser.username)
        $passwordFld.val(selectedUser.password)
        $firstnameFld.val(selectedUser.firstname)
        $lastnameFld.val(selectedUser.lastname)
        $roleFld.val(selectedUser.role)
    }

    function deleteUser(event) {
        var deleteIcon = jQuery(event.target)
        deleteIcon.attr("class");
        var deleteIconId = deleteIcon.attr("id")
        var userId = deleteIconId.substring(deleteIconId.indexOf(':') + 1)
        var userIndex = users.findIndex((user) => user._id === userId)

        userService.deleteUser(userId)
            .then(function (status) {
                users.splice(userIndex, 1)
                renderUsers(users)
            })
    }

    function clearForm() {
        $usernameFld.val("")
        $passwordFld.val("")
        $firstnameFld.val("")
        $lastnameFld.val("")
        $roleFld.prop('selectedIndex', 0)
    }

    function renderUsers(users) {
        theTableBody.empty()
        for (var i = 0; i < users.length; i++) {
            var user = users[i]
            theTableBody
                .append(`
    <tr>
        <td>${user.username}</td>
        <td></td>
        <td>${user.firstname}</td>
        <td>${user.lastname}</td>
        <td>${user.role}</td>
        <td>
            <span class="pull-right" style="white-space: nowrap">
            <i class="fa fa-2x fa-times-circle wbdv-delete btn btn-dark" id="wbdv-delete:${user._id}"></i>
            <i class="fa fa-2x fa-edit wbdv-select btn btn-dark" id="wbdv-select:${user._id}"></i>
            </span>
        </td>
    </tr>
  `)
        }
        jQuery(".wbdv-delete")
            .click(deleteUser)
        jQuery(".wbdv-select")
            .click(selectUser)
    }

    function updateUser() {
        if (!selectedUser){
            return
        }
        if(!$usernameFld.val() || !$passwordFld.val()
            || !$firstnameFld.val() || !$lastnameFld.val() || !$roleFld.val()) {
            alert('Enter values for all fields!')
            return
        }
        selectedUser.username = $usernameFld.val()
        selectedUser.password = $passwordFld.val()
        selectedUser.firstname = $firstnameFld.val()
        selectedUser.lastname = $lastnameFld.val()
        selectedUser.role = $roleFld.val()
        userService.updateUser(selectedUser._id, selectedUser)
            .then(function (status) {
                var index = users.findIndex(user => user._id === selectedUser._id)
                users[index] = selectedUser
                renderUsers(users)
                selectedUser = null
            })
        clearForm()
    }

    function init() {
        $usernameFld = $(".wbdv-username-fld")
        $passwordFld = $(".wbdv-password-fld")
        $firstnameFld = $(".wbdv-firstname-fld")
        $lastnameFld = $(".wbdv-lastname-fld")
        $roleFld = $(".wbdv-role-fld")
        $createIcon = jQuery(".wbdv-create-icon")
        $updateIcon = $(".wbdv-update-icon")
        theTableBody = jQuery("tbody")

        $updateIcon.click(updateUser)
        $createIcon.click(() => {
            if (!$usernameFld.val() || !$passwordFld.val()
                || !$firstnameFld.val() || !$lastnameFld.val() || !$roleFld.val()) {
                alert('Enter values for all fields!')
                return
            }
            createUser({
                username: $usernameFld.val(),
                password: $passwordFld.val(),
                firstname: $firstnameFld.val(),
                lastname: $lastnameFld.val(),
                role: $roleFld.val()
            })
            clearForm()
        })

        userService.findAllUsers()
            .then(function (actualUsersFromServer) {
                users = actualUsersFromServer
                renderUsers(users)
            })
    }

    jQuery(init)
})();