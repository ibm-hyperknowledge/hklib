/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

interface IVirtualNode {
    id: any;
    parent: string | null;
    datasource: IExternalDatasource | HKDatasource
}


declare class VirtualNode extends Node
{
  constructor({ id, parent, datasource } : IVirtualNode, ...args: any );
}

export { VirtualNode };

declare namespace VirtualNode {
    const type: string;
}
import { HKDatasource } from '.';
import { IExternalDatasource } from './interfaces/iexternaldatasource';
import Node from './types/node';
