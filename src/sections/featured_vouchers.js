import React from "react";
import { get_request } from "../assets/js/utils/services";
import Explore_more from "../components/explore_more";
import Loadindicator from "../components/loadindicator";
import Offer_voucher from "../components/offer_voucher";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

class Featured_vouchers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let { vouchers, vendors } = await get_request("get_offer_vouchers/10");

    this.setState({ vouchers, vendors });
  };

  render() {
    let { vouchers, vendors } = this.state;
    if (vouchers && !vouchers.length) return;

    return (
      <section className="">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-7 col-md-8">
              <div class="sec-heading center">
                <h2>
                  explore Offer <span class="theme-cl">Vouchers</span>
                </h2>
                <p>
                  Get access to your favourite vendors & Top Brands vouchers
                </p>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            {vouchers ? (
              <Swiper
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                slidesPerView={window.innerWidth < 650 ? 1 : 3}
                autoplay={{
                  delay: 2000,
                  pauseOnMouseEnter: true,
                  disableOnInteraction: false,
                }}
                loop
                className="swiper-container"
              >
                {vouchers.map((voucher) => (
                  <SwiperSlide key={voucher._id}>
                    <Offer_voucher
                      voucher={voucher}
                      full
                      vendor={
                        voucher.vendor?._id
                          ? voucher.vendor
                          : vendors[voucher.vendor]
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Loadindicator />
            )}
          </div>

          {vouchers && vouchers.length ? <Explore_more to="vouchers" /> : null}
        </div>
      </section>
    );
  }
}

export default Featured_vouchers;
