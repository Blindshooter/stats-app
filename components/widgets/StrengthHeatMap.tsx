import * as React from 'react';

interface StrengthHeatMapProps {
  teams: string[];
  matrix: Array<{
    'Team1 ': string;
    [key: string]: number | string;
  }>;
  maxValue: number;
  minValue: number;
  selectedTeam?: string;
}

export function StrengthHeatMap({ teams, matrix, maxValue, minValue, selectedTeam }: StrengthHeatMapProps) {
  const getColor = (value: number): string => {
    if (value === -1) return 'transparent';
    
    const normalizedValue = (value + 1) / 2;
    const red = Math.round(255 * (1 - normalizedValue));
    const green = Math.round(255 * normalizedValue);
    
    return `rgb(${red}, ${green}, 0)`;
  };

  const ColorLegend = (): JSX.Element => (
    <div className="flex items-center gap-2 mt-4">
      <div className="flex h-4 w-32 rounded">
        <div className="w-1/3 bg-red-500" />
        <div className="w-1/3 bg-yellow-500" />
        <div className="w-1/3 bg-green-500" />
      </div>
      <div className="flex justify-between w-32 text-xs">
        <span>Weaker</span>
        <span>Stronger</span>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Column Headers */}
      <div className="grid" style={{ 
        gridTemplateColumns: `160px repeat(${teams.length}, 35px)`,
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 10
      }}>
        <div className="h-32" />
        {teams.map(team => (
          <div 
            key={team}
            className={`h-32 flex items-center justify-center ${
              selectedTeam === team ? 'font-bold text-blue-700 text-base' : 'text-sm'
            }`}
            style={{ 
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              padding: '2px',
              backgroundColor: selectedTeam === team ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}
          >
            {team}
          </div>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid" style={{ 
        gridTemplateColumns: `160px repeat(${teams.length}, 35px)`
      }}>
        {matrix.map((row, _rowIndex) => {
          const isSelectedTeamRow = row['Team1 '] === selectedTeam;
          return (
            <React.Fragment key={row['Team1 ']}>
              {/* Row header */}
              <div 
                className={`h-8 flex items-center justify-end pr-2 whitespace-nowrap ${
                  isSelectedTeamRow ? 'font-bold text-blue-700 text-base' : 'text-sm'
                }`}
                style={{
                  backgroundColor: isSelectedTeamRow ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                }}
              >
                {row['Team1 ']}
              </div>
              {/* Row cells */}
              {teams.map(team => {
                const value = row[team] as number;
                const isSelectedTeamCell = isSelectedTeamRow || team === selectedTeam;
                const cellColor = getColor(value);
                
                return (
                  <div
                    key={`${row['Team1 ']}-${team}`}
                    className={`h-8 flex items-center justify-center relative ${
                      isSelectedTeamCell ? 'z-10' : 'text-xs'
                    }`}
                    style={{
                      backgroundColor: cellColor,
                      border: '1px solid #eee',
                      boxShadow: isSelectedTeamCell 
                        ? 'inset 0 0 0 2px rgba(59, 130, 246, 0.5)' 
                        : 'none',
                      outline: isSelectedTeamCell 
                        ? '2px solid rgba(59, 130, 246, 0.5)' 
                        : 'none',
                    }}
                    title={`${row['Team1 ']} vs ${team}: ${value === -1 ? '' : value.toFixed(2)}`}
                  >
                    <span className={isSelectedTeamCell 
                      ? 'font-semibold text-blue-700 text-xs' 
                      : 'text-[10px]'
                    }>
                      {value === -1 ? '' : value.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
      <ColorLegend />
    </div>
  );
} 