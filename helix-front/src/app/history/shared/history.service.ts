import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { HelixService } from '../../core/helix.service';
import { History } from './history.model';

@Injectable()
export class HistoryService extends HelixService {

  getControllerHistory(clusterName: string) {
    return this
      .request(`/clusters/${ clusterName }/controller/history`)
      .map(data => {
        let histories: History[] = [];

        for (let record of data.history) {
          // {DATE=2017-04-13-22:33:55, CONTROLLER=ltx1-app1133.stg.linkedin.com_12923, TIME=1492122835198}
          let history = new History();

          for (let seg of _.words(record, /[^{}, ]+/g)) {
            let name = _.words(seg, /[^=]+/g)[0];
            let value = _.words(seg, /[^=]+/g)[1];
            if (name == 'DATE') {
              history.date = value;
            } else if (name == 'CONTROLLER') {
              history.controller = value;
            } else if (name == 'TIME') {
              history.time = +value;
            }
          }

          histories.push(history);
        }

        return histories;
      });
  }

  getInstanceHistory(clusterName: string, instanceName: string) {
    // {DATE=2017-05-01T08:21:42:114, SESSION=55a8e28052bcb56, TIME=1493626902114}
  }

}
