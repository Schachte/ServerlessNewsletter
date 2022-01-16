# Serverless Newsletter Subscription Service

This is a project that runs the Newsletter system on my blog (https://ryan-schachte.com).
I will be releasing a full tutorial on this shortly.

## Notes

### Alternative Syntax For Resources

```
resources:
    - ${file(resources/iam/UserRetrievalLambdaPolicy.yml)}
    Resources:
        UsersSubscriptionTable: ${file(resources/dynamo/UsersSubscriptionTable.yml):UsersSubscriptionTable}
```