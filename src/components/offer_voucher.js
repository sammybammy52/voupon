import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import {
  commalise_figures,
  generate_random_string,
} from "../assets/js/utils/functions";
import { save_to_session } from "../sections/footer";
import { scroll_to_top } from "./explore_more";
import Preview_image from "./preview_image";

class Offer_voucher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handle_vendor = () => {
    let { vendor } = this.props;

    save_to_session("vendor", vendor);
  };

  render() {
    let { voucher, vendor, in_vouchers, voucher_code } = this.props;
    let { title, image, image_hash, total_sales, state, value } = voucher;
    let { category, name, logo, logo_hash } = vendor;

    console.log(state);

    return (
      <div
        className={
          in_vouchers
            ? "col-xl-6 col-lg-6 col-md-6 col-sm-12"
            : "col-xl-4 col-lg-4 col-md-6 col-sm-12"
        }
      >
        <div className="crs_grid">
          <div className="crs_grid_thumb">
            <Link
              to="/voucher"
              onClick={() => {
                save_to_session("voucher", {
                  ...voucher,
                  total_sales,
                  voucher_code,
                });
                save_to_session("vendor", vendor);
                scroll_to_top();
              }}
              className="crs_detail_link"
            >
              <Preview_image
                image={image || require("../assets/img/vouchers1.png")}
                image_hash={image_hash}
              />
            </Link>
          </div>
          <div className="crs_grid_caption">
            <div className="crs_flex">
              <div className="crs_fl_first">
                <div className="crs_cates cl_8">
                  <span>{category || "Entertainment"}</span>
                </div>
              </div>
              <div className="crs_fl_last">
                <div className="crs_inrolled">
                  <strong>
                    {commalise_figures(
                      total_sales || Number(generate_random_string(5, "num"))
                    )}
                  </strong>
                  Purchased
                </div>
              </div>
            </div>
            <div className="crs_title">
              <h4>
                <Link
                  to="/voucher"
                  onClick={() => {
                    save_to_session("voucher", {
                      ...voucher,
                      total_sales,
                      voucher_code,
                    });
                    save_to_session("vendor", vendor);
                    scroll_to_top();
                  }}
                  className="crs_title_link"
                >
                  {title}
                </Link>
              </h4>
            </div>
            {voucher_code ? (
              <div className="crs_info_detail">
                <CopyToClipboard text={voucher_code}>
                  <span style={{ cursor: "pointer" }}>
                    {voucher_code}{" "}
                    {state && state !== "unused" ? (
                      <div className="crs_cates cl_1">
                        <span>{state}</span>
                      </div>
                    ) : (
                      <i
                        style={{
                          color: "rgb(30, 144, 255, 0.8)",
                          fontSize: 22,
                        }}
                        className="fas fa-copy"
                      ></i>
                    )}
                  </span>
                </CopyToClipboard>
              </div>
            ) : null}
          </div>
          <div className="crs_grid_foot">
            <div className="crs_flex">
              <div className="crs_fl_first">
                <div className="crs_tutor">
                  <div className="crs_tutor_thumb">
                    <Link
                      to={`/vendor?${vendor._id}`}
                      onClick={this.handle_vendor}
                    >
                      <Preview_image
                        class_name="img-fluid circle"
                        style={{ height: 30, width: 30 }}
                        image={logo}
                        image_hash={logo_hash}
                      />
                    </Link>
                  </div>
                  <div className="crs_tutor_name">
                    <Link
                      to={`/vendor?${vendor._id}`}
                      onClick={this.handle_vendor}
                    >
                      {name}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="crs_fl_last">
                <div className="crs_price">
                  <h2>
                    <span className="currency">&#8358;</span>
                    <span className="theme-cl">
                      {commalise_figures(Number(value))}
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Offer_voucher;