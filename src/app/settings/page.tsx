import { redirect } from "next/navigation";
import React from "react";

const Settings: React.FC = ()=> {

   redirect('/settings/profile')
   
    return (
        <>
            {/* <SettingsComponent/> */}
        </>
    )
}

export default Settings;