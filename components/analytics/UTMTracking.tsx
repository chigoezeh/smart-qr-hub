"use client";

import { TrendingUp, Target, Megaphone } from "lucide-react";

interface ScanData {
  id: number;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  scannedAt: Date;
}

interface UTMTrackingProps {
  scans: ScanData[];
}

export function UTMTracking({ scans }: UTMTrackingProps) {
  // Filter scans with UTM data
  const utmScans = scans.filter(
    (scan) => scan.utmSource || scan.utmMedium || scan.utmCampaign
  );

  if (utmScans.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          UTM Campaign Tracking
        </h3>
        <div className="py-8 text-center text-gray-400">
          No UTM tracking data available. Add UTM parameters to your QR code URLs to track campaigns.
        </div>
      </div>
    );
  }

  // Aggregate by campaign
  const campaignData = new Map<string, {
    source: string;
    medium: string;
    campaign: string;
    scans: number;
  }>();

  utmScans.forEach((scan) => {
    const key = `${scan.utmCampaign || 'unknown'}-${scan.utmSource || 'unknown'}-${scan.utmMedium || 'unknown'}`;
    
    if (campaignData.has(key)) {
      const existing = campaignData.get(key)!;
      existing.scans += 1;
    } else {
      campaignData.set(key, {
        source: scan.utmSource || 'Unknown',
        medium: scan.utmMedium || 'Unknown',
        campaign: scan.utmCampaign || 'Unknown',
        scans: 1,
      });
    }
  });

  const campaigns = Array.from(campaignData.values())
    .sort((a, b) => b.scans - a.scans);

  const totalUTMScans = utmScans.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          UTM Campaign Tracking
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-600">{totalUTMScans} tracked scans</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">#</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Campaign</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Source</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Medium</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Scans</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Share</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, index) => {
              const percentage = ((campaign.scans / totalUTMScans) * 100).toFixed(1);
              
              return (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 text-sm text-gray-500">{index + 1}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-900">{campaign.campaign}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-600 px-2 py-1 bg-blue-50 rounded">
                      {campaign.source}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-600 px-2 py-1 bg-green-50 rounded">
                      {campaign.medium}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-right font-semibold text-gray-900">
                    {campaign.scans}
                  </td>
                  <td className="py-3 px-2 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-600 w-12">{percentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Add UTM parameters to your URLs like{" "}
          <code className="px-1 py-0.5 bg-white rounded text-xs">
            ?utm_source=instagram&utm_medium=social&utm_campaign=summer2024
          </code>
        </p>
      </div>
    </div>
  );
}
