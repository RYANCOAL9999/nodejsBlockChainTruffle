function generalHeader(agent, user, password)
{
    var headerObject = {
        "user-ageent" : agent,
        "x-kconsultingpro-digest":"kconsultingpro-haha-debug-123456789101112131415-",
        "content-type" : "application/x-www-form-urlencoded",
    };
    if(user)
    {
        headerObject["x-kconsultingpro-user"] = user;
    }
    if(password)
    {
        headerObject["x-kconsultingpro-password"] = password;
    }
    return headerObject;
}