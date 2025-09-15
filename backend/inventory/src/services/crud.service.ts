import { Model, ModelStatic, Transaction } from "sequelize";

const crudService = <T extends Model>(Model: ModelStatic<T>) => ({
  async create(
    data: Partial<T["_creationAttributes"]>,
    options: { transaction?: Transaction } = {}
  ) {
    try {
      const [details] = await Model.upsert(data as any, {
        returning: true,
        transaction: options.transaction,
      });
      return details;
    } catch (error) {
      throw error;
    }
  },

  async getAll(options: { transaction?: Transaction } = {}) {
    try {
      return await Model.findAll({
        where: { status: 1 } as any,
        order: [["updatedAt", "DESC"]],
        transaction: options.transaction,
      });
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number, options: { transaction?: Transaction } = {}) {
    try {
      return await Model.findByPk(id, { transaction: options.transaction });
    } catch (error) {
      throw error;
    }
  },

  async update(
    id: number,
    data: Partial<T["_creationAttributes"]>,
    options: { transaction?: Transaction } = {}
  ) {
    try {
      const [affectedCount, affectedRows] = await Model.update(data as any, {
        where: { id: id } as any,
        returning: true,
        transaction: options.transaction,
      });

      if (affectedCount === 0) return null;
      return affectedRows[0];
    } catch (error) {
      throw error;
    }
  },

  async remove(id: number, options: { transaction?: Transaction } = {}) {
    try {
      const [affectedCount, affectedRows] = await Model.update(
        { status: 0 },
        {
          where: { id } as any,
          returning: true,
          transaction: options.transaction,
        }
      );

      if (affectedCount === 0) return null;
      return affectedRows[0];
    } catch (error) {
      throw error;
    }
  },
});

export default crudService;
