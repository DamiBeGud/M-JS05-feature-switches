import { Problem, identifier, integer } from './common.js';
export class Switches {
  flags=new Map();
  create(name,input) {
    name=identifier(name);
    if (typeof input?.enabled!=='boolean') throw new Problem(400,'boolean_required');
    if (this.flags.has(name)) throw new Problem(409,'duplicate_flag');
    if (this.flags.size>=1000) throw new Problem(409,'flag_limit');
    const row={ name, enabled:input.enabled, version:1 }; this.flags.set(name,row); return {...row};
  }
  get(name) { const row=this.flags.get(identifier(name)); if (!row) throw new Problem(404,'not_found'); return {...row}; }
  update(name,input) {
    const row=this.get(name); integer(input?.expectedVersion,1,1000000);
    if (typeof input.enabled!=='boolean') throw new Problem(400,'boolean_required');
    if (input.expectedVersion!==row.version) throw new Problem(409,'stale_version');
    const next={...row,enabled:input.enabled,version:row.version+1}; this.flags.set(name,next); return {...next};
  }
}
