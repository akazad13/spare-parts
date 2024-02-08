using Dapper;
using System.Data;
using System.Data.SqlClient;
using static Dapper.SqlMapper;

namespace SpareParts.Data.Core
{
    public class DBAccess : IDisposable
    {
        private readonly IDbConnection db;

        public DBAccess(string connectionString)
        {
            db = new SqlConnection(connectionString);
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public Task<ResponseObjectType> GetInfo<ResponseObjectType>(object obj, string sp)
        {
            return db.QueryFirstOrDefaultAsync<ResponseObjectType>(
                sp,
                obj,
                commandType: CommandType.StoredProcedure
            );
        }

        public Task<ResponseObjectType> GetInfo<ResponseObjectType>(
            object obj,
            string sp,
            int commandTimeout
        )
        {
            return db.QueryFirstOrDefaultAsync<ResponseObjectType>(
                sp,
                obj,
                commandType: CommandType.StoredProcedure,
                commandTimeout: commandTimeout
            );
        }

        public Task<IEnumerable<ResponseObjectType>> GetInfoList<ResponseObjectType>(
            object obj,
            string sp
        )
        {
            return db.QueryAsync<ResponseObjectType>(
                sp,
                obj,
                commandType: CommandType.StoredProcedure
            );
        }

        public Task<IEnumerable<ResponseObjectType>> GetInfoList<ResponseObjectType>(
            object obj,
            string sp,
            int commandTimeout
        )
        {
            return db.QueryAsync<ResponseObjectType>(
                sp,
                obj,
                commandType: CommandType.StoredProcedure,
                commandTimeout: commandTimeout
            );
        }

        public Task<GridReader> GetInfoMultipleList(object obj, string sp)
        {
            return db.QueryMultipleAsync(sp, obj, commandType: CommandType.StoredProcedure);
        }

        public Task<GridReader> GetInfoMultipleList(object obj, string sp, int commandTimeout)
        {
            return db.QueryMultipleAsync(
                sp,
                obj,
                commandType: CommandType.StoredProcedure,
                commandTimeout: commandTimeout
            );
        }

        public async void BasicOperation(object obj, string sp)
        {
            await db.QueryAsync(sp, obj, commandType: CommandType.StoredProcedure);
        }

        public async void BasicOperation(object obj, string sp, int commandTimeout)
        {
            await db.QueryAsync(
                sp,
                obj,
                commandType: CommandType.StoredProcedure,
                commandTimeout: commandTimeout
            );
        }

        public Task<dynamic> BasicQueryOperation(object obj, string sp)
        {
            return db.QueryFirstOrDefaultAsync(sp, obj, commandType: CommandType.StoredProcedure);
        }

        public Task<dynamic> BasicQueryOperation(object obj, string sp, int commandTimeout)
        {
            return db.QueryFirstOrDefaultAsync(
                sp,
                obj,
                commandType: CommandType.StoredProcedure,
                commandTimeout: commandTimeout
            );
        }

        public Task<IEnumerable<dynamic>> BasicQueryOperationList(object obj, string sp)
        {
            return db.QueryAsync(sp, obj, commandType: CommandType.StoredProcedure);
        }

        public Task<IEnumerable<dynamic>> BasicQueryOperationList(
            object obj,
            string sp,
            int commandTimeout
        )
        {
            return db.QueryAsync(
                sp,
                obj,
                commandType: CommandType.StoredProcedure,
                commandTimeout: commandTimeout
            );
        }
    }
}
