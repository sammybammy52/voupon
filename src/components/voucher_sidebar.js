import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  commalise_figures,
  date_string,
  time_string,
  to_title,
} from "../assets/js/utils/functions";
import Buy_ticket from "./buy_ticket";
import Get_voucher from "./get_voucher";
import Modal from "./modal";
import Redeem_voucher from "./redeem_voucher";
import Text_btn from "./text_btn";
import Ticket_codes from "./ticket_codes";
import Transfer_voucher from "./transfer_voucher";

class Voucher_sidebar extends React.Component {
  constructor(props) {
    super(props);

    let { voucher_code, ticket_code } = this.props;

    this.state = { voucher_code: voucher_code || ticket_code };
  }

  redeem_voucher = () => this.redeem_voucher_?.toggle();

  transfer_voucher = () => this.transfer_voucher_?.toggle();

  componentDidMount = async () => {};

  purchase_voucher = () => this.purchase_voucher_?.toggle();

  toggle_ticket_codes = () => this.codes?.toggle();

  parse_datetime = (datetime) => {
    let date = new Date(datetime).getTime();

    return `${date_string(date)}, ${time_string(date)}`;
  };

  toggle_read_more = () => this.setState({ full: !this.state.full });

  render() {
    let { voucher_code, full } = this.state;
    let { voucher, vendor, on_redeem, on_tranfer, event } = this.props;
    if (!voucher) voucher = event;

    let { address } = vendor;
    let {
      value,
      actual_price,
      _id,
      state,
      event_date_time,
      quantities,
      ticket,
      short_description,
    } = voucher;

    let is_event = _id.startsWith("event");

    if (is_event) {
      address = event.location;

      quantities = event.quantity;
    }

    voucher_code = voucher_code || voucher.voucher_code;

    return (
      <div className="col-lg-4 col-md-12 order-lg-last">
        <div className="ed_view_box style_2 border min pt-3">
          <span className="ml-3">
            {voucher_code
              ? is_event
                ? "Ticket Code"
                : "Voucher Code:"
              : is_event
              ? "Ticket Price"
              : "Voucher Value"}
          </span>

          {state === "closed" ? (
            <div className="ml-2 crs_cates cl_1">Closed</div>
          ) : null}
          <div className="ed_author">
            {voucher_code ? (
              Array.isArray(voucher_code) && voucher_code.length > 1 ? (
                <>
                  <span style={{ fontSize: 18 }}>
                    <span>Quantity:</span>{" "}
                    <span>
                      <b>{voucher_code.length}</b>
                    </span>
                  </span>
                  &nbsp; &nbsp;
                  <div>
                    <Text_btn
                      text="View ticket codes"
                      style={{ fontWeight: "bold" }}
                      action={this.toggle_ticket_codes}
                    />
                  </div>
                  <br />
                </>
              ) : (
                <>
                  <CopyToClipboard
                    text={
                      state !== "unused"
                        ? null
                        : Array.isArray(voucher_code)
                        ? voucher_code[0]
                        : voucher_code
                    }
                  >
                    <h2 style={{ cursor: "pointer" }} className="theme-cl m-0">
                      {voucher_code}&nbsp;&nbsp;
                      {state !== "unused" ? (
                        <div className="crs_cates cl_1">
                          <span>{state}</span>
                        </div>
                      ) : (
                        <span>
                          <i
                            style={{
                              color: "rgb(30, 144, 255, 0.8)",
                              fontSize: 22,
                            }}
                            className="fas fa-copy"
                          ></i>
                        </span>
                      )}
                    </h2>
                  </CopyToClipboard>
                </>
              )
            ) : (
              <h2 className="theme-cl m-0">
                {Number(value) > 0 ? (
                  <>
                    &#8358;{commalise_figures(value)}
                    {actual_price ? (
                      <span className="old_prc">
                        &#8358;{commalise_figures(actual_price)}
                      </span>
                    ) : null}
                  </>
                ) : (
                  "Free"
                )}
              </h2>
            )}
          </div>
          {voucher_code ? (
            state !== "unused" ? null : (
              <div className="ed_view_link">
                <a
                  href="#"
                  onClick={this.redeem_voucher}
                  class="btn theme-light enroll-btn"
                >
                  Redeem Voucher<i class="ti-angle-right"></i>
                </a>
                <a
                  href="#"
                  onClick={this.transfer_voucher}
                  class="btn theme-light enroll-btn"
                >
                  Transfer Ownership<i class="ti-angle-right"></i>
                </a>
              </div>
            )
          ) : state === "closed" ? null : (
            <div className="ed_view_link">
              <a
                href="#"
                onClick={this.purchase_voucher}
                className="btn theme-bg enroll-btn"
              >
                {is_event
                  ? `${Number(value) > 0 ? "Buy" : "Get"} Ticket`
                  : "Get Voucher"}
                <i className="ti-angle-right"></i>
              </a>
            </div>
          )}
          <div className="ed_view_features">
            <div className="eld mb-3">
              <h5 className="font-medium">
                {is_event ? "Event Description" : "What this offer is about:"}
              </h5>
              <p>
                {full ? short_description : short_description.slice(0, 200)}
              </p>
              {short_description?.length > 200 ? (
                <span
                  className="theme-cl cursor-pointer"
                  style={{ fontStyle: "italic", marginLeft: 5 }}
                  onClick={this.toggle_read_more}
                >
                  {full ? "Show less" : "...Read more"}
                </span>
              ) : null}
            </div>
            <div className="eld mb-3">
              <ul className="edu_list right">
                <li>
                  <i className="ti-time"></i>
                  {is_event
                    ? "Total tickets remaining"
                    : "Quantities Remaining"}
                  :<strong>{quantities}</strong>
                </li>
                {is_event ? (
                  <li>
                    <i className="ti-calendar"></i>
                    Date and Time
                    <strong>{this.parse_datetime(event_date_time)}</strong>
                  </li>
                ) : null}
                <li>
                  <i className="ti-map"></i>Location:
                  <strong>{to_title(address)}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Modal
          ref={(redeem_voucher_) => (this.redeem_voucher_ = redeem_voucher_)}
        >
          <Redeem_voucher
            voucher={{ ...voucher, voucher_code }}
            on_redeem={on_redeem}
            toggle={this.redeem_voucher}
          />
        </Modal>

        <Modal
          ref={(transfer_voucher_) =>
            (this.transfer_voucher_ = transfer_voucher_)
          }
        >
          <Transfer_voucher
            voucher={{ ...voucher, voucher_code }}
            on_tranfer={on_tranfer}
            toggle={this.transfer_voucher}
          />
        </Modal>

        <Modal
          ref={(purchase_voucher_) =>
            (this.purchase_voucher_ = purchase_voucher_)
          }
        >
          {is_event ? (
            <Buy_ticket
              event={event}
              vendor={vendor}
              on_purchase={(voucher_code) => this.setState({ voucher_code })}
              toggle={this.purchase_voucher}
            />
          ) : (
            <Get_voucher
              voucher={voucher}
              vendor={vendor}
              on_purchase={(voucher_code) => this.setState({ voucher_code })}
              toggle={this.purchase_voucher}
            />
          )}
        </Modal>

        <Modal ref={(codes) => (this.codes = codes)}>
          <Ticket_codes
            ticket={ticket}
            event={event}
            toggle={this.toggle_ticket_codes}
          />
        </Modal>
      </div>
    );
  }
}

export default Voucher_sidebar;
