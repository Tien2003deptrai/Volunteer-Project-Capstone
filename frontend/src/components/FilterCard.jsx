import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setLocationFilter, setJobTypeFilter, setExperienceFilter, clearFilters } from '@/redux/dutySlice'
import { MapPin, Briefcase, Award, X, Loader2 } from 'lucide-react'
import useGetFilterOptions from '@/hooks/useGetFilterOptions'

const FilterCard = () => {
  const dispatch = useDispatch();
  const { locationFilter, jobTypeFilter, experienceFilter } = useSelector(store => store.duty);
  const { filterOptions, loading } = useGetFilterOptions();

  const getExperienceLabel = (level) => {
    const labels = {
      1: "Entry Level (1)",
      2: "Intermediate (2)",
      3: "Advanced (3)"
    };
    return labels[level] || `Level ${level}`;
  };

  const handleLocationChange = (value) => {
    dispatch(setLocationFilter(value));
  };

  const handleJobTypeChange = (value) => {
    dispatch(setJobTypeFilter(value));
  };

  const handleExperienceChange = (value) => {
    const match = value.match(/\((\d+)\)/);
    if (match) {
      dispatch(setExperienceFilter(match[1]));
    } else {
      dispatch(setExperienceFilter(''));
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = locationFilter || jobTypeFilter || experienceFilter;

  const getExperienceDisplayValue = () => {
    if (experienceFilter === "1") return "Entry Level (1)";
    if (experienceFilter === "2") return "Intermediate (2)";
    if (experienceFilter === "3") return "Advanced (3)";
    return "";
  };

  return (
    <div className='w-full min-w-64 bg-white p-5 mb-4 rounded-lg shadow-md border border-gray-200 sticky top-4'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='font-bold text-xl text-gray-800'>Filter Duties</h1>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className='text-xs text-gray-600 hover:text-gray-900'
          >
            <X className='h-4 w-4 mr-1' />
            Clear
          </Button>
        )}
      </div>
      <hr className='mb-4 border-gray-200' />

      {/* Location Filter */}
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-3'>
          <MapPin className='h-5 w-5 text-blue-600' />
          <h2 className='font-semibold text-base text-gray-700'>Location</h2>
        </div>
        {loading ? (
          <div className='flex items-center justify-center py-4'>
            <Loader2 className='h-4 w-4 animate-spin text-gray-400' />
          </div>
        ) : (
          <RadioGroup value={locationFilter} onValueChange={handleLocationChange}>
            <div className='space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
              {filterOptions.locations.length > 0 ? (
                filterOptions.locations.map((item, idx) => {
                  const itemId = `location-${idx}`
                  return (
                    <div key={idx} className='flex items-center space-x-2 group hover:bg-gray-50 p-2 rounded-md transition-colors'>
                      <RadioGroupItem value={item} id={itemId} className='cursor-pointer' />
                      <Label
                        htmlFor={itemId}
                        className='cursor-pointer flex-1 text-sm text-gray-700 group-hover:text-gray-900'
                      >
                        {item}
                      </Label>
                    </div>
                  )
                })
              ) : (
                <p className='text-sm text-gray-500 py-2'>No locations available</p>
              )}
            </div>
          </RadioGroup>
        )}
      </div>

      <hr className='mb-4 border-gray-200' />

      {/* Job Type Filter */}
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-3'>
          <Briefcase className='h-5 w-5 text-green-600' />
          <h2 className='font-semibold text-base text-gray-700'>Job Type</h2>
        </div>
        {loading ? (
          <div className='flex items-center justify-center py-4'>
            <Loader2 className='h-4 w-4 animate-spin text-gray-400' />
          </div>
        ) : (
          <RadioGroup value={jobTypeFilter} onValueChange={handleJobTypeChange}>
            <div className='space-y-2'>
              {filterOptions.jobTypes.length > 0 ? (
                filterOptions.jobTypes.map((item, idx) => {
                  const itemId = `jobType-${idx}`
                  return (
                    <div key={idx} className='flex items-center space-x-2 group hover:bg-gray-50 p-2 rounded-md transition-colors'>
                      <RadioGroupItem value={item} id={itemId} className='cursor-pointer' />
                      <Label
                        htmlFor={itemId}
                        className='cursor-pointer flex-1 text-sm text-gray-700 group-hover:text-gray-900'
                      >
                        {item}
                      </Label>
                    </div>
                  )
                })
              ) : (
                <p className='text-sm text-gray-500 py-2'>No job types available</p>
              )}
            </div>
          </RadioGroup>
        )}
      </div>

      <hr className='mb-4 border-gray-200' />

      {/* Experience Level Filter */}
      <div className='mb-4'>
        <div className='flex items-center gap-2 mb-3'>
          <Award className='h-5 w-5 text-purple-600' />
          <h2 className='font-semibold text-base text-gray-700'>Experience Level</h2>
        </div>
        {loading ? (
          <div className='flex items-center justify-center py-4'>
            <Loader2 className='h-4 w-4 animate-spin text-gray-400' />
          </div>
        ) : (
          <RadioGroup value={getExperienceDisplayValue()} onValueChange={handleExperienceChange}>
            <div className='space-y-2'>
              {filterOptions.experienceLevels.length > 0 ? (
                filterOptions.experienceLevels.map((level, idx) => {
                  const item = getExperienceLabel(level);
                  const itemId = `experience-${idx}`
                  return (
                    <div key={idx} className='flex items-center space-x-2 group hover:bg-gray-50 p-2 rounded-md transition-colors'>
                      <RadioGroupItem value={item} id={itemId} className='cursor-pointer' />
                      <Label
                        htmlFor={itemId}
                        className='cursor-pointer flex-1 text-sm text-gray-700 group-hover:text-gray-900'
                      >
                        {item}
                      </Label>
                    </div>
                  )
                })
              ) : (
                <p className='text-sm text-gray-500 py-2'>No experience levels available</p>
              )}
            </div>
          </RadioGroup>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <p className='text-xs text-gray-500 mb-2'>Active Filters:</p>
          <div className='flex flex-wrap gap-2'>
            {locationFilter && (
              <span className='inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full'>
                <MapPin className='h-3 w-3' />
                {locationFilter}
              </span>
            )}
            {jobTypeFilter && (
              <span className='inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full'>
                <Briefcase className='h-3 w-3' />
                {jobTypeFilter}
              </span>
            )}
            {experienceFilter && (
              <span className='inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full'>
                <Award className='h-3 w-3' />
                {experienceFilter === "1" ? "Entry Level" :
                  experienceFilter === "2" ? "Intermediate" :
                    experienceFilter === "3" ? "Advanced" : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterCard
