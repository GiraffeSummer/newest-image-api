const permissions = {
    none: 0,
    member: "perms when logged in",
    download: "get files via api",
    upload: "able to upload gifs",
    access_user: "can see other users uploads",
    delete_content: "Delete gifs others have uploaded",
    manage_user: "can change permissions of other users",
    read_users: "can read data of users, this is to moderate actions only",
    read_logs: "can read logs",
    all_perms_allowed: "everything allowed",

}

module.exports = permissions
