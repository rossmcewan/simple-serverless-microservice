const getIsolationAwareName = (name, separator='_') => {
  if (process.env.isolation === "silo") {
    return `${name}${separator}${process.env.TENANT_ID}`;
  }
  return name;
};

module.exports.getRoleName = () => {
  return getIsolationAwareName("simple_role");
};

module.exports.getFunctionName = () => {
  return getIsolationAwareName("simple_function");
};

module.exports.getServiceName = () => {
  return getIsolationAwareName(process.env.serviceName, '-');
};

module.exports.getTableName = () => {
  if (
    process.env.isolation === "silo" &&
    process.env.tableIsolationStrategy === "table_per_tenant"
  ) {
    return `simple_table_${process.env.TENANT_ID}`;
  }
  return "simple_table";
};

module.exports.getTablePermissions = () => {
    const permissions = {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource:['${self:resources.Outputs.simpleTableArn.Value}']
    }
    if(process.env.tableIsolationStrategy === 'pk_per_tenant'){
        permissions.Condition = {
            'ForAllValues:StringLike': {
                'dynamodb:LeadingKeys': [
                    `${process.env.TENANT_ID}-*`
                ]
            }
        }
    }
    return permissions;
};
