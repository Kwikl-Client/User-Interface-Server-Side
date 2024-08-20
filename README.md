APIS for book
{
all -(http://localhost:7000/chapters/literature)
single chapter-(http://localhost:7000/chapters/literature?chapterName=Journey)
get a scene from chapter -(http://localhost:7000/chapters/plot?chapterName=Journey&sceneNumber=2)
epilogues -(http://localhost:7000/chapters/epilogue?chapterName=Journey)
delete any scene -http://localhost:7000/chapters/delete-scene
delete any epilogue http://localhost:7000/chapters/delete-epilogue
upload any scene -http://localhost:7000/chapters/uploadScene
upload any epilogue- http://localhost:7000/chapters/uploadEpilogue
}

get user details from jwt token - http://localhost:7000/customer/verifyTkn/${token}
edit customer details- {"http://localhost:7000/customer/editCustomerDetails", payload, config}
login api:{'http://localhost:7000/customer/loginCustomer', credentials}
forget password: {'http://localhost:7000/customer/forgotPassword', { email: forgetCreds }}
community status-level2(http://localhost:7000/customer/raiseCommunityRequest/${cId})
level-3, level-4 api is not yet done will do in next phase