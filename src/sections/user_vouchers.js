import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { to_title } from "../assets/js/utils/functions";
import { get_request } from "../assets/js/utils/services";
import Create_open_voucher from "../components/create_open_voucher";
import Listempty from "../components/listempty";
import Loadindicator from "../components/loadindicator";
import Modal from "../components/modal";
import Offer_voucher from "../components/offer_voucher";
import User_voucher_header from "../components/user_voucher_header";
import Voucher from "../components/voucher";
import { Loggeduser } from "../Contexts";

const voucher_tabs = new Array("open vouchers", "offer vouchers");

class User_vouchers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active_tab: voucher_tabs[0],
      filter: "unused",
    };
  }

  componentDidMount = async () => {
    if (!this.loggeduser) {
      this.loggeduser = window.sessionStorage.getItem("loggeduser");
      if (this.loggeduser) this.loggeduser = JSON.parse(this.loggeduser);
      else window.history.go(-1);
    }

    let { open_vouchers, offer_vouchers } = await get_request(
      `user_vouchers/${this.loggeduser._id}`
    );

    this.setState({ open_vouchers, offer_vouchers });
  };

  on_create_open_voucher = (voucher) => {
    let { open_vouchers } = this.state;

    open_vouchers = new Array(voucher, ...open_vouchers);
    this.setState({ open_vouchers });
  };

  toggle_create_voucher = () => this.create_voucher?.toggle();

  voucher_states = new Array("unused", "used", "redeemed");

  render() {
    let { style } = this.props;
    let { active_tab, filter, open_vouchers, offer_vouchers } = this.state;

    return (
      <Loggeduser.Consumer>
        {({ loggeduser }) => {
          this.loggeduser = loggeduser;
          return (
            <section className="min" style={{ ...style }}>
              <div className="container">
                <Tabs
                  defaultActiveKey={active_tab}
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  {voucher_tabs.map((tab) => (
                    <Tab eventKey={tab} title={to_title(tab)} key={tab}>
                      <>
                        <User_voucher_header
                          voucher_filters={this.voucher_states}
                          set_voucher_filter={(filter) =>
                            this.setState({ filter })
                          }
                          toggle_create_voucher={
                            tab === voucher_tabs[0] &&
                            this.toggle_create_voucher
                          }
                          voucher_type={tab}
                        />

                        <div className="row justify-content-center">
                          <div className="col-lg-7 col-md-8">
                            <div className="sec-heading center">
                              {tab === voucher_tabs[0] ? (
                                <p>
                                  Voucher that can be used for any service a
                                  partner, channel, platform or shop provides.
                                </p>
                              ) : (
                                <p>
                                  Voucher that can be used specifically for a
                                  particular service a partner, channel,
                                  platform or shop provides.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row justify-content-center">
                          {((vouchers) =>
                            vouchers ? (
                              vouchers.length ? (
                                vouchers.map((voucher, index) => {
                                  if (!voucher.state) voucher.state = "unused";

                                  return voucher.state === filter ? (
                                    voucher?._id.startsWith("user") ? (
                                      <Offer_voucher
                                        voucher={{
                                          ...voucher.voucher,
                                          state: voucher.state,
                                        }}
                                        voucher_code={voucher.voucher_code}
                                        vendor={voucher.voucher.vendor}
                                        key={index}
                                      />
                                    ) : (
                                      <Voucher
                                        voucher={{
                                          ...voucher.voucher,
                                          state: voucher.state,
                                        }}
                                        voucher_code={voucher.voucher_code}
                                        vendor={voucher.vendor}
                                        key={index}
                                      />
                                    )
                                  ) : null;
                                })
                              ) : (
                                <Listempty />
                              )
                            ) : (
                              <Loadindicator />
                            ))(
                            tab === voucher_tabs[0]
                              ? open_vouchers
                              : offer_vouchers
                          )}
                        </div>
                      </>
                    </Tab>
                  ))}
                </Tabs>
              </div>

              <Modal
                ref={(create_voucher) => (this.create_voucher = create_voucher)}
              >
                <Create_open_voucher
                  on_create={this.on_create_open_voucher}
                  toggle={this.toggle_create_voucher}
                />
              </Modal>
            </section>
          );
        }}
      </Loggeduser.Consumer>
    );
  }
}

export default User_vouchers;
