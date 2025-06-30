import { unifiedRepository, EntityRepository, AggregateRepository } from '../repository';

export const entityRepository = unifiedRepository.entities;
export const aggregateRepository = unifiedRepository.aggregates;

export { unifiedRepository };

export { EntityRepository, AggregateRepository }; 