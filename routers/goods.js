const express = require("express");
const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");

const router = express.Router();

const cheerio = require("cheerio");
const axios = require("axios");
const iconv = require("iconv-lite");
const url =
    "http://www.yes24.com/24/Category/BestSeller";


    router.get("/goods/add/crawling", async (req, res) => {
        try {
          //크롤링 대상 웹사이트 HTML 가져오기
          await axios({
            url: url,
            method: "GET",
            responseType: "arraybuffer",
          }).then(async (html) => {
              //크롤링 코드
            const content = iconv.decode(html.data, "EUC-KR").toString();//iconv패키지로 디코드
            const $ = cheerio.load(content);
            const list = $("ol li");//ol li로 뽑아오고
      
            await list.each( async (i, tag) => {//책들에대한 정보얻어오고
              let desc = $(tag).find("p.copy a").text() 
              let image = $(tag).find("p.image a img").attr("src")
              let title = $(tag).find("p.image a img").attr("alt")
              let price = $(tag).find("p.price strong").text()
            
              if(desc && image && title && price){ //모든 정보가 있어야 가져옴
                price = price.slice(0,-1).replace(/(,)/g, "")//문자를 들어온걸 슬라이스로 맨뒤에 하나 자르기 ','를찾아서 빈문자열로 바꾼다
                let date = new Date()
                let goodsId = date.getTime()//고유한 숫자 값으로 정해줌
                await Goods.create({
                  goodsId:goodsId,
                  name:title,
                  thumbnailUrl:image,
                  category:"도서",
                  price:price
                })
              }
        
            });
          })
          res.send({ result: "success", message: "크롤링이 완료 되었습니다." });
      
        } catch (error) {
          //실패 할 경우 코드
          res.send({ result: "fail", message: "크롤링에 문제가 발생했습니다", error:error });
        }
      });

router.get("/goods", async (req, res, next) => {
    try {
        const { category } = req.query;
        const goods = await Goods.find({ category }).sort("-goodsId");
        res.json({ goods: goods });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/goods/:goodsId", async (req, res) => {
    const { goodsId } = req.params;
    goods = await Goods.findOne({ goodsId: goodsId });
    res.json({ detail: goods });
});

router.post('/goods', async (req, res) => {
    try {
        const { goodsId, name, thumbnailUrl, category, price } = req.body;

        isExist = await Goods.find({ goodsId });
        if (isExist.length == 0) {
            await Goods.create({ goodsId, name, thumbnailUrl, category, price });
        }
        res.send({ result: "success" });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post("/goods/:goodsId/cart", async (req, res) => {
    console.log(req.params)
    console.log(req.body)

    const { goodsId } = req.params;
    const { quantity } = req.body;

    isCart = await Cart.find({ goodsId });
    console.log(isCart, quantity);
    if (isCart.length) {
        await Cart.updateOne({ goodsId }, { $set: { quantity } });
    } else {
        await Cart.create({ goodsId: goodsId, quantity: quantity });
    }
    res.send({ result: "success" });

});

router.delete("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params
    const isGoddsInCart = await cart.find({ goodsId });
    if (isGoddsInCart.length > 0) {
        await Cart.deleteOne({ goodsId });

    }
    res.send({ result: "success" });
})

router.patch("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    const isGoodsInCart = await Cart.find({ goodsId });
    if (isGoodsInCart.length > 0) {
        await Cart.updateOne({ goodsId }, { $set: { quantity } })
    }
    res.send({ result: "success" });

})

router.get("/cart", async (req, res) => {
    const cart = await Cart.find({});
    const goodsId = cart.map(cart => cart.goodsId);

    goodsInCart = await Goods.find()
        .where("goodsId")
        .in(goodsId);

    concatCart = cart.map(c => {
        for (let i = 0; i < goodsInCart.length; i++) {
            if (goodsInCart[i].goodsId == c.goodsId) {
                return { quantity: c.quantity, goods: goodsInCart[i] };
            }
        }
    });

    res.json({
        cart: concatCart
    });
});

module.exports = router;