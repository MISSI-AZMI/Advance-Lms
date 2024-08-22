
export const CAE = (passedFunction)=> (req,res,next)=>
{
    Promise.resolve(passedFunction(req,res,next)).catch(next)

}