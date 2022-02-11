import React, { useState } from "react";
import { PageHeader, Button } from "antd";
import "./style.scss";

function AccountInfo({
  handleLogout, privKey,account
}) {
 
 const [privateKeyHidden, setPkeyVisiblity] = useState(false);

 console.log("account",account)
 return (
  <div>
      <PageHeader
          className="site-page-header"
          title="Openlogin x Terra"
          extra={[
              <Button key="1" type="primary" onClick={()=>handleLogout(false)}>
              Logout
              </Button>,
          ]}
      />
      <div className="container">
      <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
          <span>Private key:</span>
          {
              !privateKeyHidden ? 
              <div style={{margin:20, maxWidth: 900, wordWrap: "break-word", display:"flex", flexDirection:"column"}}>
                <span style={{margin: 20}}>{"********************************"}</span>
                <button type="button" onClick={()=>{setPkeyVisiblity(true)}}>Show Terra Private Key</button>
              </div>:
              <div style={{margin:20, maxWidth: 900, wordWrap: "break-word", display:"flex", flexDirection:"column"}}>
               <span style={{margin: 20}}>{(privKey)}</span>
                <button onClick={()=>{setPkeyVisiblity(false)}}>Hide Private Key</button>
              </div>
            }

            <code>
              <div style={{margin:20, maxWidth: 900, wordWrap: "break-word", display:"flex", flexDirection:"column"}}>
               <span style={{margin: 20}}>{(JSON.stringify(account || {}))}</span>
              </div>
            </code>

        </div>
      </div>
</div>
)
}

export default AccountInfo;