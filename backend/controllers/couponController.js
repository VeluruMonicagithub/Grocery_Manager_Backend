import * as CouponModel from "../models/couponModel.js";

export const fetchCoupons = async (req, res) => {
    const { data, error } = await CouponModel.getActiveCoupons();

    if (error) return res.status(400).json({ error });

    res.json(data);
};
