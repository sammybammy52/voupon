import React from "react";
import { get_request } from "../assets/js/utils/services";
import Loadindicator from "../components/loadindicator";
import Padder from "../components/padder";
import Vendor_header from "../components/vender_header";
import { Loggeduser } from "../Contexts";
import Footer, { get_session } from "../sections/footer";
import Nav from "../sections/nav";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { to_title } from "../assets/js/utils/functions";
import Vendor_vouchers from "../components/vendor_vouchers";
import Vendor_coupons from "../components/vendor_coupons";
import Vendor_tickets from "../components/vendor_ticket";
import Vendor_settings from "../components/vendor_settings";
import { client_domain, organisation_name } from "../assets/js/utils/constants";
import Text_btn from "../components/text_btn";
import Transactions from "../components/transactions";
import Vendor_marketplace from "../components/vendor_marketplace";

const vendor_tabs = new Array(
  "vouchers",
  "coupons",
  "tickets",
  "ENPL",
  "transactions",
  "settings"
);

class Vendor_profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = { active_tab: vendor_tabs[0] };
  }

  get_vendor = async (vendor) => {
    let vendor_id = window.location.href.split("?");
    if (vendor_id[1]) vendor = await get_request(`vendor/${vendor_id[1]}`);

    if (!vendor) return window.history.go(-1);

    document.title = `${to_title(vendor.name)} | ${organisation_name}`;

    this.setState({ vendor });
  };

  componentDidMount = async () => {
    let vendor = get_session("vendor");

    if (vendor) {
      await this.get_vendor(vendor);
    } else {
      await this.get_vendor(vendor);
    }
  };

  render() {
    let { vendor, active_tab } = this.state;

    return (
      <Loggeduser.Consumer>
        {({ loggeduser }) => {
          this.loggeduser = loggeduser;

          return (
            <div id="main-wrapper">
              <Nav page="vendor" />
              <Padder />

              {!vendor || typeof vendor !== "object" ? (
                <Loadindicator contained />
              ) : (
                <>
                  <Vendor_header loggeduser={loggeduser} vendor={vendor} />

                  <div className="container">
                    <div className="row align-items-center mb-5">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        {vendor.verified ? (
                          <Tabs
                            defaultActiveKey={active_tab}
                            id="uncontrolled-tab-example"
                            className="mb-3"
                          >
                            {vendor_tabs.map((tab) => {
                              if (vendor_tabs.slice(-2).includes(tab)) {
                                if (
                                  !loggeduser ||
                                  (loggeduser &&
                                    loggeduser.vendor !== vendor._id)
                                )
                                  return;
                              }

                              return (
                                <Tab
                                  eventKey={tab}
                                  title={to_title(tab)}
                                  key={tab}
                                >
                                  {tab === "vouchers" ? (
                                    <Vendor_vouchers
                                      loggeduser={loggeduser}
                                      vendor={vendor}
                                    />
                                  ) : tab === "coupons" ? (
                                    <Vendor_coupons
                                      vendor={vendor}
                                      loggeduser={loggeduser}
                                    />
                                  ) : tab === "tickets" ? (
                                    <Vendor_tickets
                                      loggeduser={loggeduser}
                                      vendor={vendor}
                                    />
                                  ) : tab === "ENPL" ? (
                                    <Vendor_marketplace
                                      loggeduser={loggeduser}
                                      vendor={vendor}
                                    />
                                  ) : tab === "settings" ? (
                                    <Vendor_settings vendor={vendor} />
                                  ) : (
                                    <Transactions wallet={vendor.wallet} />
                                  )}
                                </Tab>
                              );
                            })}
                          </Tabs>
                        ) : (
                          <div style={{ textAlign: "center" }}>
                            <Text_btn
                              text="go home"
                              action={() =>
                                window.location.assign(client_domain)
                              }
                              style={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Footer />
            </div>
          );
        }}
      </Loggeduser.Consumer>
    );
  }
}

export default Vendor_profile;
