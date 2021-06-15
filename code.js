function onEdit(event) {
  
  const new_link_url = event.value;
  const old_link_url_check = event.oldValue;

  if(new_link_url === old_link_url_check){
    SpreadsheetApp.getUi().alert('Please CLEAR the old value');
  }
  else{
    
    const link_id = new_link_url.match(/.*\/(.*)\/(.*)$/);

    //this is the file we need to copy
    var file_to_copy = DriveApp.getFileById(link_id[1]);

    // console.log(file.getName())
    // 13/06/2021 Maranatha Zoom
    // 2021/02/28 Maranatha Zoom

    const file_name = file_to_copy.getName();
    const file_create_date = file_name.substring(0,11);

    if(!file_create_date.match(/^d{4}$/)) {
      const parts = file_create_date.split("/");
      var date_object = new Date(parseInt(parts[2], 10),
                  parseInt(parts[1], 10) - 1,
                  parseInt(parts[0], 10));
    }
    else {
      var date_object = new Date(file_create_date);
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    console.log("this is the date", date_object)
    // this is the date Sun Jun 13 2021 00:00:00 GMT+0530 (India Standard Time)

    const day = (parseInt(date_object.getUTCDate()) < 10 ? `0${date_object.getUTCDate()}` : date_object.getUTCDate());
    const month = (parseInt(date_object.getUTCMonth()+1) < 10 ? `0${date_object.getUTCMonth()+1}` : date_object.getUTCMonth()+1);
    const month_name = monthNames[parseInt(month)-1];
    const year = date_object.getUTCFullYear();
    
    console.log(day, month, year, month_name);

    //create a folder name for the file (if its June then we need a June folder)
    const folder_name = `${year}-${month_name}`;

    //create a name for the file in YYYY-MM-DD format
    const new_save_file_name = `${year}-${month}-${day}`;

    //is folder there for the given month?
    const bible_sessions_folder = DriveApp.getFolderById("1awxeJqC-V8SmcMuxCLTNjFTMekyU8rxi");
    console.log(bible_sessions_folder);

    //let the program know if folder is already existing. set to true if folder found. then it will execute to create a new folder.
    let folder_found_flag = false;

    var folders_list = DriveApp.getFolders();
    while (folders_list.hasNext()) {
      var folder = folders_list.next();
      // console.log(folder.getName(), typeof folder.getName(), folder_name, typeof folder_name)
      if (folder.getName() === folder_name) {
        //then just create the file and exit while loop
        const copied_file = file_to_copy.makeCopy(new_save_file_name);
        const folder_id = folder.getId(); 
        const folder_name_in_drive = DriveApp.getFolderById(folder_id);
        copied_file.moveTo(folder_name_in_drive)
        folder_found_flag = true;
        break;
      }
    }

    if(!folder_found_flag) {
      // create folder , then create file and exit while loop
      const new_folder_created_for_month = bible_sessions_folder.createFolder(folder_name);
      const copied_file = file_to_copy.makeCopy(new_save_file_name);
      copied_file.moveTo(new_folder_created_for_month); 
    }

  }
}
