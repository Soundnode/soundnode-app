import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-updater',
  templateUrl: './updater.component.html',
  styleUrls: ['./updater.component.css']
})
export class UpdaterComponent implements OnInit {
  updateAvailable: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const url = 'https://api.github.com/repos/Soundnode/soundnode-app/releases';
    const config = {
      headers: {
        'Accept': 'application/vnd.github.v3.raw+json'
      }
    };

    this.http.get(url, config).subscribe(
      (response: any[]) => {
        const release = response[0];
        const isMasterRelease = release.target_commitish === 'master';

        if (isMasterRelease) {
          if (this.settings.appVersion < release.tag_name) {
            this.updateAvailable = true;
          }
        }
      },
      (error) => {
        console.log('Error checking if a new version is available', error);
      }
    );
  }
}