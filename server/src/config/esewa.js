const crypto= require("crypto")

function sign(fields,fieldsName){
    const message=fieldsName.map((name)=>`${name}=${fields[name]}`)
      return crypto.createHmac("sha256", process.env.ESEWA_SECRET_KEY).update(message).digest("base64")
}
function buildPaymentForm(order,transactionUuid){
    const amount=String(order.totalAmount)
    
  const fields = {
    amount,
    tax_amount: "0",
    total_amount: amount, // = amount + tax + service charge + delivery charge
    transaction_uuid: transactionUuid, // unique for every payment attempt
    product_code: process.env.ESEWA_PRODUCT_CODE,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: process.env.ESEWA_SUCCESS_URL,
    failure_url: process.env.ESEWA_FAILURE_URL,
    signed_field_names: "total_amount,transaction_uuid,product_code"
  }
  fields.signature = sign(fields, fields.signed_field_names.split(","))
 
  return { action: process.env.ESEWA_FORM_URL, fields }
}

function decodeAndVerifyCallback(base64Data){
    let data
    try {
        data=JSON.parse(Buffer.from(base64Data,'base64').toString("utf8"))
        
    } catch (error) {
        return null
    }
    const expected=Buffer.from(sign(data,data.signed_field_names.split(",")))
    const recived=Buffer.from(sign(data.signature))
    if(expected.length!=recived.length) return null
    if(!crypto.timingSafeEqual(expected,recived)) return null
    return data


}
async function checkTransactionStatus({ totalAmount, transactionUuid }) {
  const url = new URL(process.env.ESEWA_STATUS_URL)
  url.searchParams.set("product_code", process.env.ESEWA_PRODUCT_CODE)
  url.searchParams.set("total_amount", String(totalAmount))
  url.searchParams.set("transaction_uuid", transactionUuid)
 
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw gatewayError("eSewa status check failed", data)
 
  return data // contains `status` ("COMPLETE", "PENDING", "NOT_FOUND", ...)
}
 


module.exports={buildPaymentForm,decodeAndVerifyCallback, checkTransactionStatus}